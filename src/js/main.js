import { renderPartials, getScripture, fetchJSON} from "./utils.js";
import { setupModal, setupWordLookup } from "./wordLookup.mjs";
import { getNoteFormHTML, attachFormListeners } from "./noteInputForm.mjs";

let allBooksData = []; 


async function populateDropdowns() {
    const bookSelect = document.getElementById('book');
    const translationSelect = document.getElementById('translation');

    const fetchedBooks = await fetchJSON('../json/books.json');
    const translations = await fetchJSON('../json/translations.json');

    if (fetchedBooks) {
        allBooksData = fetchedBooks; 
    }

    // --- Book Dropdown Population ---
    if (bookSelect && allBooksData.length > 0) { // Check against new global data
        bookSelect.innerHTML = '';
        allBooksData.forEach(book => {
            const option = document.createElement('option');
            option.value = book.name; 
            option.textContent = book.name;
            bookSelect.appendChild(option);
        });
        bookSelect.value = 'Genesis'; 
        
        bookSelect.addEventListener('change', updateChapterDropdown);
        
        populateChapters(bookSelect.value); 
        console.log("Books dropdown populated dynamically.");
    }
    
    if (translationSelect && translations) {
        translationSelect.innerHTML = '';
        translations.forEach(t => { 
            const option = document.createElement('option');
            option.value = t.key;
            option.textContent = t.name;
            translationSelect.appendChild(option);
        });
        translationSelect.value = 'web';
        console.log("Translations dropdown populated dynamically from JSON config.");
    }
}


function populateChapters(selectedBookName) {
    const chapterSelect = document.getElementById('chapter');
    if (!chapterSelect) return;

    const bookData = allBooksData.find(book => book.name === selectedBookName);
    const maxChapters = bookData ? bookData.chapters : 0;

    chapterSelect.innerHTML = ''; 

    if (maxChapters > 0) {
        for (let i = 1; i <= maxChapters; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Chapter ${i}`;
            chapterSelect.appendChild(option);
        }
        chapterSelect.value = 1; 
    } else {
        chapterSelect.innerHTML = '<option value="">(No chapters)</option>';
    }
}

/**
 * NEW MANDATORY FUNCTION: Event handler to update chapters on book change.
 */
function updateChapterDropdown(event) {
    const selectedBookName = event.target.value;
    populateChapters(selectedBookName);
}


function setupFormSubmission() {
    const form = document.getElementById('fetch-scripture-form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const book = form.elements.book.value.trim(); 
            // NEW: Get the chapter value
            const chapter = form.elements.chapter.value.trim();
            const verses = form.elements.verses.value.trim(); 
            const translation = form.elements.translation.value.trim();
            
            const displayArea = document.getElementById('scripture-display-area');
            displayArea.innerHTML = '<p>Fetching scripture from API...</p>';
            
            // 1. Construct the combined reference string (Book Chapter:Verses)
            let fullReference = `${book} ${chapter}`;
            if (verses !== '') {
                 fullReference += `:${verses}`; // Add colon only if verses are present
            }
            
            // 2. Ensure we have minimum required reference
            if (!book || !chapter) {
                displayArea.innerHTML = `<p class="error-message">Please select a Book and Chapter.</p>`;
                return;
            }

            try {
                // MANDATORY FIX 4: Call getScripture with the new, simplified signature
                const data = await getScripture(fullReference, translation); 
                renderScripture(data); 

            } catch (error) {
                console.error(error);
                // Propagates the custom error message from utils.js
                displayArea.innerHTML = `<p class="error-message">${error.message}</p>`; 
            }
        });
    }
}

// ... (renderScripture, setupButtonToRenderForm, and DOMContentLoaded remain correct) ...
function renderScripture(data) {
    const displayArea = document.getElementById('scripture-display-area');
    
    if (data.error) {
         displayArea.innerHTML = `<p class="error-message">Error: ${data.error}</p>`;
         return;
    }
    
    const scriptureRef = data.reference;
    
    displayArea.innerHTML = `
        <div class="scripture-card">
            <p class="reference">${scriptureRef} (${data.translation_name})</p>
            <p id="scripture-text" class="text-content">${data.text}</p>
        </div>
        <button id="add-note-btn" class="btn-primary">Add Note for this Scripture</button>
    `;
    setupWordLookup('scripture-text', scriptureRef);
    setupButtonToRenderForm(scriptureRef); 
}

function setupButtonToRenderForm(scriptureRef) {
    const addNoteBtn = document.getElementById('add-note-btn');
    const displayArea = document.getElementById('scripture-display-area');

    if (addNoteBtn && displayArea) {
        addNoteBtn.addEventListener('click', function() {
            
            this.style.display = 'none';

            displayArea.insertAdjacentHTML('beforeend', getNoteFormHTML(scriptureRef));
            attachFormListeners(); 
            
            const formWrapper = document.getElementById('note-form-wrapper');
            if (formWrapper) {
                formWrapper.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await renderPartials(); 
    await populateDropdowns(); 
    setupFormSubmission(); 
    setupModal(); 
});