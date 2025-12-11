//Hamburger Menu
export function setupHamburgerMenu() {
    const button = document.querySelector('.hamburger');
    const navLinks = document.querySelector('#main-nav-links');

    if (button && navLinks) {
        button.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
            
            button.classList.toggle('is-active');

            const isExpanded = button.getAttribute('aria-expanded') === 'true' || false;
            button.setAttribute('aria-expanded', !isExpanded);
        });
        navLinks.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                navLinks.classList.remove('nav-open');
                button.classList.remove('is-active');
                button.setAttribute('aria-expanded', 'false');
            }
        });
    } else {
        console.error("Hamburger menu elements (.hamburger or #main-nav-links) not found.");
    }
}

// Footer Date
export function setupFooterDate(yearId = "year", lastModId = "lastModified") {
    const yearSpan = document.getElementById(yearId);
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    const lastMod = document.getElementById(lastModId);
    if (lastMod) {
        lastMod.textContent = "Last Modified: " + document.lastModified;
    }
}

export async function renderPartials() {
    const body = document.body;

    try {
        const headerResponse = await fetch('../partials/header.html');
        const headerHTML = await headerResponse.text();
        body.insertAdjacentHTML('afterbegin', headerHTML);

        const footerResponse = await fetch('../partials/footer.html');
        const footerHTML = await footerResponse.text();
        body.insertAdjacentHTML('beforeend', footerHTML);

        setupFooterDate();
        setupHamburgerMenu();

    } catch (error) {
        console.error("Failed to render partials. Check file paths and server status.", error);
    }
}

const BIBLE_API_BASE_URL = 'https://bible-api.com'; 
const WIKTIONARY_API_BASE_URL = 'https://en.wiktionary.org/w/api.php'; 

export async function getScripture(reference) {
    const endpoint = `/${encodeURIComponent(reference)}`; 
    const fullUrl = `${BIBLE_API_BASE_URL}${endpoint}`;
    
    console.log(`Fetching scripture from: ${fullUrl}`);

    try {
        const response = await fetch(fullUrl);
        
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ error: 'Unknown API Error' }));
            throw new Error(`Bible API HTTP error! Status: ${response.status}. Message: ${errorBody.error || response.statusText}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error(`Error fetching scripture for ${reference}:`, error);
        throw error;
    }
}


export async function getWiktionaryDefinition(word) {
    const params = new URLSearchParams({
        action: 'query',
        titles: word,
        prop: 'revisions',
        rvprop: 'content', 
        format: 'json',
        origin: '*'
    });
    
    const fullUrl = `${WIKTIONARY_API_BASE_URL}?${params.toString()}`;

    console.log(`Searching Wiktionary for: ${fullUrl}`);

    try {
        const response = await fetch(fullUrl);
        
        if (!response.ok) {
            throw new Error(`Wiktionary API HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Note: Wiktionary data requires parsing the nested JSON structure.
        // It's not a direct definition string. We'll return the raw object for now.
        return data; 
        
    } catch (error) {
        console.error(`Error fetching Wiktionary definition for ${word}:`, error);
        throw error;
    }
}