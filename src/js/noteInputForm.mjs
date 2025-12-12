import { NoteManager } from './noteManager.mjs'; 

const noteManager = new NoteManager();

export function getNoteFormHTML(scriptureRef) {
    return `
        <div id="note-form-wrapper" class="card-display">
            <h3>Add a Note for: ${scriptureRef}</h3>
            <form id="note-input-form">
                
                <input type="hidden" id="note-scripture-ref" value="${scriptureRef}">
                
                <div class="form-row">
                    <label for="note-content">Note Content:</label>
                    <textarea id="note-content" rows="5" required></textarea>
                </div>
                
                <div class="input-group">
                    <div class="form-row half-width">
                        <label for="reading-context">Context/Topic:</label>
                        <input type="text" id="reading-context" required placeholder="e.g., Talk, Study Group">
                    </div>

                    <div class="form-row half-width">
                        <label for="mood-score">Mood Score (1-5):</label>
                        <input type="number" id="mood-score" min="1" max="5" value="3" required>
                    </div>
                </div>

                <div class="form-row">
                    <label for="keywords">Keywords (comma separated):</label>
                    <input type="text" id="keywords" placeholder="e.g., humility, prayer, discipleship">
                </div>
                
                <button type="submit" class="btn-primary">Save Note</button>
            </form>
        </div>
    `;
}

export function attachFormListeners() {
    const form = document.getElementById('note-input-form');
    if (form) {
        form.addEventListener('submit', async function(event) { 
            event.preventDefault();

            await noteManager.loadNotes();
            
            const noteData = {
                scriptureRef: document.getElementById('note-scripture-ref').value.trim(),
                noteContent: document.getElementById('note-content').value.trim(),
                readingContext: document.getElementById('reading-context').value.trim(),
                moodScore: parseInt(document.getElementById('mood-score').value, 10),
                keywords: document.getElementById('keywords').value
                    .split(',')
                    .map(k => k.trim())
                    .filter(k => k.length > 0),
                associatedQuizScore: 0, 
                isFavorite: false      
            };
            
            try {
                const newNote = noteManager.addNote(noteData); 
                
                alert(`Note saved successfully! Scripture: ${newNote.scriptureRef}`);
                
                const formWrapper = document.getElementById('note-form-wrapper');
                if (formWrapper) formWrapper.remove(); 
                
                const addNoteBtn = document.getElementById('add-note-btn');
                if (addNoteBtn) addNoteBtn.style.display = 'block'; 
                
            } catch (error) {
                console.error("Error saving note:", error);
                alert("Failed to save note. Please check console and Local Storage.");
            }
        });
    }
}