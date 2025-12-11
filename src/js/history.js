import { renderPartials } from './utils.js';
import { NoteManager } from './NoteManager.mjs';

const noteManager = new NoteManager();
const historyDisplayAreaId = 'note-history-display-area';

/**
 * Renders the full list of notes into the history view.
 */
async function renderHistoryView() {
    const displayArea = document.getElementById(historyDisplayAreaId);
    if (!displayArea) return;

    displayArea.innerHTML = '<p>Loading note history...</p>';

    try {
        // Load data from Local Storage or fallback JSON
        const notes = await noteManager.loadNotes();
        
        if (notes.length === 0) {
            displayArea.innerHTML = '<p>No notes found. Start by saving a note on the main page!</p>';
            return;
        }

        let notesHTMLArray = notes.map(note => {
            const date = new Date(note.timestamp).toLocaleDateString();
            const time = new Date(note.timestamp).toLocaleTimeString();
            
            return `
                <div class="note-card" data-note-id="${note.id}">
                    <div class="note-header">
                        <h4>${note.scriptureRef}</h4>
                        <button class="delete-note-btn" data-id="${note.id}">Delete</button>
                    </div>
                    
                    <p class="note-content">${note.noteContent}</p>
                    
                    <div class="note-details">
                        <span>Context: ${note.readingContext}</span> | 
                        <span>Mood: ${note.moodScore} / 5</span> |
                        <span>Keywords: ${note.keywords.join(', ')}</span>
                    </div>
                    
                    <span class="note-date">${date} at ${time}</span>
                    ${note.isFavorite ? '<span class="favorite-icon">⭐️</span>' : ''}
                </div>
            `;
        });

        displayArea.innerHTML = notesHTMLArray.join('');
        
        // NEW: Attach listeners after rendering is complete
        attachDeleteListeners(); 

    } catch (error) {
        console.error("Failed to render note history:", error);
        displayArea.innerHTML = `<p class="error-message">Error loading history: ${error.message}</p>`;
    }
}

/**
 * Attaches event listeners for the Delete buttons using event delegation.
 */
function attachDeleteListeners() {
    const displayArea = document.getElementById(historyDisplayAreaId);
    if (!displayArea) return;

    displayArea.addEventListener('click', (event) => {
        const target = event.target;
        
        // Check if the clicked element is a delete button
        if (target.classList.contains('delete-note-btn')) {
            const noteId = target.dataset.id;
            
            if (confirm('Are you sure you want to delete this note?')) {
                const wasDeleted = noteManager.deleteNote(noteId);
                
                if (wasDeleted) {
                    // Visually remove the card from the DOM without full re-render
                    const noteCard = target.closest('.note-card');
                    if (noteCard) {
                        noteCard.remove();
                    }
                    
                    // Optional: If the list is now empty, re-render to show "No notes found"
                    if (noteManager.getAllNotes().length === 0) {
                        renderHistoryView();
                    }
                    
                } else {
                    alert('Error: Note could not be found or deleted.');
                }
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    renderPartials(); 
    renderHistoryView();
});