import { renderPartials } from './utils.js';
import { getRandomVerse } from './utils.js';

const QUIZ_CONTAINER_ID = 'quiz-container';

let currentVerseData = null; 

async function startQuiz() {
    const container = document.getElementById(QUIZ_CONTAINER_ID);
    container.innerHTML = '<p>Fetching random verse...</p>';
    
    try {
        currentVerseData = await getRandomVerse();
        renderGuessingForm(currentVerseData);
    } catch (error) {
        container.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

function renderGuessingForm(data) {
    const container = document.getElementById(QUIZ_CONTAINER_ID);
    
    const verseText = data.random_verse.text || 'Verse text could not be loaded.';

    container.innerHTML = `
        <div class="verse-challenge">
            <h4>Guess the Scripture Reference!</h4>
            <div class="scripture-text">
                <blockquote>"${verseText}"</blockquote>
            </div>

            <form id="guess-form" class="guess-inputs">
                <div class="input-row">
                    <label for="guess-book">Book Name:</label>
                    <input type="text" id="guess-book" required placeholder="e.g., Genesis">
                </div>
                <div class="input-row small-inputs">
                    <label for="guess-chapter">Chapter (Optional):</label>
                    <input type="number" id="guess-chapter" min="1">
                    <label for="guess-verse">Verse (Optional):</label>
                    <input type="number" id="guess-verse" min="1">
                </div>
                
                <button type="submit" class="btn-primary">Check Guess</button>
            </form>

            <div id="results-area" class="quiz-feedback-box"></div>
        </div>
    `;

    attachFormListener();
}

function attachFormListener() {
    const form = document.getElementById('guess-form');
    if (form) {
        form.addEventListener('submit', handleGuess);
    }
}

function handleGuess(event) {
    event.preventDefault();

    if (!currentVerseData) return;

    const correctData = currentVerseData.random_verse;

    // Correct Answers
    const correctBook = correctData.book;
    const correctChapter = parseInt(correctData.chapter, 10);
    const correctVerse = parseInt(correctData.verse, 10);
    const fullRef = `${correctBook} ${correctChapter}:${correctVerse}`;

    // User Guesses
    const guessBook = document.getElementById('guess-book').value.trim();
    // Use Number() to get the numerical value, which results in 0 or NaN if field is empty
    const guessChapter = Number(document.getElementById('guess-chapter').value); 
    const guessVerse = Number(document.getElementById('guess-verse').value);
    
    // 2. Score the Guess (Revised Point System)
    let totalScore = 0;
    let feedback = '';
    const MAX_SCORE = 6; // Max is 1 (Book) + 2 (Chapter) + 3 (Verse)

    // --- 1. Check Book (1 Point) ---
    const bookCorrect = guessBook.toLowerCase() === correctBook.toLowerCase();
    if (bookCorrect) {
        totalScore += 1; // 1 point for the book
        feedback += '<p class="correct">✅ Book Guess: Correct! (+1 pt)</p>';
    } else {
        feedback += `<p class="incorrect">❌ Book Guess: Incorrect. (Was: ${correctBook})</p>`;
    }

    // --- 2. Check Chapter (2 Points, Optional) ---
    // Check if the user attempted a guess (value is not NaN and is > 0)
    if (!isNaN(guessChapter) && guessChapter > 0) {
        const chapterCorrect = guessChapter === correctChapter;
        if (chapterCorrect) {
            totalScore += 2; // 2 points for the chapter
            feedback += '<p class="correct">✅ Chapter Guess: Correct! (+2 pts)</p>';
        } else {
            feedback += `<p class="incorrect">❌ Chapter Guess: Incorrect. (Was: ${correctChapter})</p>`;
        }
    } else {
         feedback += `<p class="info">— Chapter Guess: Skipped (0 pts)</p>`;
    }

    // --- 3. Check Verse (3 Points, Optional) ---
    // Check if the user attempted a guess
    if (!isNaN(guessVerse) && guessVerse > 0) {
        const verseCorrect = guessVerse === correctVerse;
        if (verseCorrect) {
            totalScore += 3; // 3 points for the verse
            feedback += '<p class="correct">✅ Verse Guess: Correct! (+3 pts)</p>';
        } else {
            feedback += `<p class="incorrect">❌ Verse Guess: Incorrect. (Was: ${correctVerse})</p>`;
        }
    } else {
         feedback += `<p class="info">— Verse Guess: Skipped (0 pts)</p>`;
    }
    
    // 4. Display Results and Next Button
    const resultsArea = document.getElementById('results-area');
    resultsArea.innerHTML = `
        <div class="score-summary">
            <h3>Total Score: ${totalScore} / ${MAX_SCORE} points</h3>
            ${feedback}
            <p>The correct reference was: <strong>${fullRef}</strong></p>
        </div>
        <button id="next-verse-btn" class="btn-primary">Next Verse</button>
    `;
    
    // Disable guess inputs
    document.querySelectorAll('#guess-form input, #guess-form button[type="submit"]').forEach(el => el.disabled = true);
    
    // Attach listener for next verse
    document.getElementById('next-verse-btn').addEventListener('click', startQuiz);
}

document.addEventListener('DOMContentLoaded', async () => {
    await renderPartials();
    startQuiz();
});