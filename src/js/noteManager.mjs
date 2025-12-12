import { Note } from './note.mjs'; 

const NOTES_STORAGE_KEY = 'scriptureNotes';

export class NoteManager {
    constructor() {
        this.notes = [];
    }

    async loadNotes() {
        const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
        
        let rawNotes;
        if (storedNotes) {
            console.log("Notes loaded from Local Storage.");
            rawNotes = JSON.parse(storedNotes);
        } else {
            console.log("No notes in Local Storage. Fetching initial data from JSON.");
            rawNotes = await this.fetchInitialNotes();
        }
        
        // Reconstitute raw objects into Note class instances (Rehydration)
        this.notes = rawNotes.map(noteObj => {
            const rehydratedNote = new Note(
                noteObj.scriptureRef,
                noteObj.noteContent,
                noteObj.readingContext,
                noteObj.moodScore,
                noteObj.keywords,
                noteObj.associatedQuizScore || 0,
                noteObj.isFavorite || false
            );
            // Overwrite the generated ID/timestamp with the saved data
            rehydratedNote.id = noteObj.id;
            rehydratedNote.timestamp = noteObj.timestamp;
            return rehydratedNote;
        });

        return this.notes;
    }

    async fetchInitialNotes() {
        try {
            const response = await fetch('../data/notesHistory.json'); 
            
            if (!response.ok) {
                throw new Error(`Failed to fetch notesHistory.json: ${response.statusText}`);
            }
            const initialNotes = await response.json();
            return initialNotes;
        } catch (error) {
            console.error("Error fetching initial notes:", error);
            return []; 
        }
    }
    
    saveNotes() {
        try {
            const notesJSON = JSON.stringify(this.notes);
            localStorage.setItem(NOTES_STORAGE_KEY, notesJSON);
            console.log(`Saved ${this.notes.length} notes to Local Storage.`);
        } catch (e) {
            console.error("Error saving notes to Local Storage:", e);
            alert("Warning: Could not save notes! Storage capacity might be full.");
        }
    }

    addNote(noteData) {
        const newNote = new Note(
            noteData.scriptureRef,
            noteData.noteContent,
            noteData.readingContext,
            noteData.moodScore,
            noteData.keywords,
            noteData.associatedQuizScore,
            noteData.isFavorite
        );
        this.notes.unshift(newNote);
        this.saveNotes();
        return newNote;
    }


    getAllNotes() {
        return [...this.notes];
    }
    
    /**
     * Deletes a note by its unique ID (noteId). Returns true if deleted, false otherwise.
     */
    deleteNote(noteId) {
        const initialLength = this.notes.length;
        
        // Filter out the note with the matching ID
        this.notes = this.notes.filter(note => note.id !== noteId);
        
        const wasDeleted = this.notes.length < initialLength;
        
        if (wasDeleted) {
            this.saveNotes();
            console.log(`Note with ID ${noteId} deleted.`);
        } else {
            console.warn(`Note with ID ${noteId} not found.`);
        }
        
        return wasDeleted;
    }
}