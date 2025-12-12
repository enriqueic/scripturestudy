import { getWiktionaryDefinition } from './utils.js'; 

// Helper function to clean up common MediaWiki markup for better display
function cleanWikiContent(wikiText) {
    if (!wikiText) return 'Definition not found.';
    
    let cleanedText = wikiText;
    cleanedText = cleanedText.replace(/\{\{[^}]*\}\}/g, ''); 
    cleanedText = cleanedText.replace(/\[\[([^|\]]+?)\|([^\]]+?)\]\]/g, '$2');
    cleanedText = cleanedText.replace(/\[\[([^\]]+?)\]\]/g, '$1');
    cleanedText = cleanedText.replace(/'''/g, '**'); 
    cleanedText = cleanedText.replace(/''/g, '*'); 
    cleanedText = cleanedText.replace(/\[\[:Category:[^\]]*\]\]/g, '');
    
    return cleanedText.trim();
}

export function setupModal() {
    const modalHTML = `
        <div id="definition-modal" class="modal">
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h3 id="modal-word-title"></h3>
                <div id="modal-definition-body">Loading definition...</div>
            </div>
        </div>
    `;
    
    if (!document.getElementById('definition-modal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById('definition-modal');
    const closeBtn = document.querySelector('#definition-modal .close-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Makes the rendered scripture text interactive for word lookup.
export function setupWordLookup(elementId, scriptureRef) {
    const scriptureTextElement = document.getElementById(elementId);
    if (!scriptureTextElement) return;

    const rawText = scriptureTextElement.textContent;
    const words = rawText.match(/\b\w+\b/g) || []; 
    
    let newHTML = rawText;
    words.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        newHTML = newHTML.replace(regex, `<span class="lookup-word">${word}</span>`);
    });
    
    scriptureTextElement.innerHTML = newHTML;

    // Attach click event to each word
    scriptureTextElement.querySelectorAll('.lookup-word').forEach(span => {
        span.addEventListener('click', async (event) => {
            const word = event.target.textContent;
            await showDefinitionModal(word, scriptureRef);
        });
    });
}

async function showDefinitionModal(word, scriptureRef) {
    const modal = document.getElementById('definition-modal');
    const title = document.getElementById('modal-word-title');
    const body = document.getElementById('modal-definition-body');

    if (!modal || !title || !body) return;

    title.textContent = `Definition for: ${word}`;
    body.innerHTML = '<p>Searching Wiktionary...</p>';
    modal.style.display = 'block'; // <-- This line makes the modal visible

    try {
        const data = await getWiktionaryDefinition(word);
        
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        const revisions = pages[pageId].revisions;
        
        let rawContent = 'Definition not found.';
        if (revisions && revisions.length > 0) {
            rawContent = revisions[0]['*'];
        }

        const cleanedContent = cleanWikiContent(rawContent);
        const finalDisplayContent = cleanedContent.substring(0, 500) + (cleanedContent.length > 500 ? '...' : '');
        
        body.innerHTML = `<pre class="wiki-content">${finalDisplayContent}</pre>`; 
        
    } catch (error) {
        body.innerHTML = `<p class="error-message">Could not fetch definition: ${error.message}</p>`;
    }
}