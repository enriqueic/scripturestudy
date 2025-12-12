export class Note {
    constructor(
        scriptureRef,
        noteContent,
        readingContext,
        moodScore,
        keywords,
        associatedQuizScore = 0,
        isFavorite = false       
    ) {
        this.id = Date.now().toString() + Math.random().toString(36).substring(2, 9); // Simple unique ID
        this.timestamp = new Date().toISOString();
        
        this.scriptureRef = scriptureRef;
        this.noteContent = noteContent;
        this.readingContext = readingContext;
        this.moodScore = moodScore;
        this.keywords = keywords;
        this.associatedQuizScore = associatedQuizScore;
        this.isFavorite = isFavorite;
    }
}