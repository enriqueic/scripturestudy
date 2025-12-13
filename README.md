# scripturestudy
A dynamic application to help with your scripture mastery and notetaking. Uses Node.js and Vite.

## Features
Main application: Select any Bible passage with a multitude of translations. Add notes with context, keywords, and rate your mood. 

History: Notes are saved persistently and are displayed chronologically. You can delete any card.

Trivia: A random verse from the King James Version (KJV). Guess the book (required), chapter (optional), and verse (optional) and earn points.

## Project structure
index.html	The main application.
history.html	Displays the user's history of saved notes.
trivia.html	Scripture reference quiz.

js/note.mjs	Defines the note class
js/noteManager.mjs	Handles all application persistence (localstorage)
js/utils.js 	Contains helper functions, including API calls. Renders partials, and hamburger menu