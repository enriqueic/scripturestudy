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

export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

//API Utilities

const BIBLE_API_BASE_URL = 'https://bible-api.com'; 
const WIKTIONARY_API_BASE_URL = 'https://en.wiktionary.org/w/api.php';

export async function getScripture(reference, translation = 'web') {
    
    if (!reference || reference.trim() === '') {
        throw new Error("Scripture reference cannot be empty.");
    }
    
    const finalTranslation = translation ? translation.trim() : 'web'; 
    
    const endpoint = `/${encodeURIComponent(reference.trim())}?translation=${finalTranslation}`;
    const fullUrl = `${BIBLE_API_BASE_URL}${endpoint}`;
    
    console.log(`Fetching scripture from: ${fullUrl}`);

    try {
        const response = await fetch(fullUrl);
        
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ 
                error: `HTTP Error ${response.status}: Failed to parse API error.` 
            }));
            
            throw new Error(errorBody.error || `Bible API HTTP Error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
             throw new Error(data.error);
        }

        return data;
        
    } catch (error) {
        console.error("Final Scripture Fetch Error:", error.message);
        throw new Error(`Error fetching scripture: ${error.message}`);
    }
}

export async function getWiktionaryDefinition(word) {
    const fullUrl = `${WIKTIONARY_API_BASE_URL}?action=query&prop=revisions&titles=${word}&rvprop=content&format=json&origin=*`;
    
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
        throw new Error(`Wiktionary API HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
}

export async function getRandomVerse() {
    const BIBLE_API_BASE_URL = 'https://api.scripture.api.bible/v1/bibles'; 
    const baseApiUrl = 'https://bible-api.com/data'; 
    const translation = 'kjv'; 
    const fullUrl = `${baseApiUrl}/${translation}/random`;
    
    
    try {
        const response = await fetch(fullUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}: Failed to fetch random KJV verse from: ${fullUrl}`);
        }
        
        const data = await response.json();
        
        return data; 
        
    } catch (error) {
        console.error("Error fetching random verse:", error.message);
        throw new Error("Could not load random verse for the quiz.");
    }
}