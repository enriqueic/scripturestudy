export class Note {
    constructor(
        scriptureRef,
        noteContent,
        readingContext,
        moodScore,
        keywords,
        associatedQuizScore = 0, // Default to 0 if not provided
        isFavorite = false        // Default to false if not provided
    ) {
        // Properties automatically generated upon creation
        this.id = Date.now().toString() + Math.random().toString(36).substring(2, 9); // Simple unique ID
        this.timestamp = new Date().toISOString();
        
        // Data provided by the user
        this.scriptureRef = scriptureRef;
        this.noteContent = noteContent;
        this.readingContext = readingContext;
        this.moodScore = moodScore;
        this.keywords = keywords;
        this.associatedQuizScore = associatedQuizScore;
        this.isFavorite = isFavorite;
    }
}