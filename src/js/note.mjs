export default class Note {
    constructor(
        scriptureRef, 
        noteContent, 
        readingContext, 
        moodScore, 
        keywords,
        associatedQuizScore = 0,
        isFavorite = false
    ) {
        const nowISO = new Date().toISOString();
        this.noteId = `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`; 
        this.scriptureRef = scriptureRef;
        this.noteContent = noteContent;
        this.dateCreated = nowISO; 
        this.keywords = keywords; 
        this.readingContext = readingContext;
        this.moodScore = moodScore;
        this.lastModified = nowISO; 
        this.associatedQuizScore = associatedQuizScore;
        this.isFavorite = isFavorite; 
    }
    updateContent(newContent) {
        this.noteContent = newContent;
        this.lastModified = new Date().toISOString();
    }
}