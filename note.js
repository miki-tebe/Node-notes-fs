const fs = require('fs');

let fetchNotes = () => {
    try {
        let notesString = fs.readFileSync('notes-data.json');
        return JSON.parse(notesString);
    } catch (error) {
        return [];
    }
};
let saveNotes = (notes) => {
    fs.writeFileSync('notes-data.json', JSON.stringify(notes));
};
let addNote = (title, body) => {
    let notes = fetchNotes();
    let note = {
        title,
        body
    };
    let duplicateNotes = notes.filter((note) => note.title === title);

    if (duplicateNotes.length === 0) {
        notes.push(note);
        saveNotes(notes);
        return note;
    }
};
let getAll = () => {
    return fetchNotes();
};
let getNote = (title) => {
    let notes = fetchNotes();
    let znote = notes.filter((note) => note.title === title);
    return znote[0];
};
let removeNote = (title) => {
    let notes = fetchNotes();
    let znote = notes.filter((note) => note.title !== title);
    saveNotes(znote);
    return notes.length !== znote.length;
};
let logNote = (note) => {
    console.log('--');
    console.log('Title : ', note.title);
    console.log('Body : ', note.body);
};
module.exports = {
    addNote,
    getAll,
    getNote,
    removeNote,
    logNote
};