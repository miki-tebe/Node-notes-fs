const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

const notes = require('./note');

// adding public assets
app.use('/asset', express.static(__dirname + '/public'));
//handlebar middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
//body pasrser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// method override middleware
app.use(methodOverride('_method'));
//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.get('/', (req, res) => {
    let allNotes = notes.getAll();
    res.render('index', {
        title: 'Home',
        allNotes
    });
});
app.get('/add', (req, res) => {
    res.render('add', {
        title: 'Add Note'
    });
});
app.post('/add', (req, res) => {
    let note = notes.addNote(req.body.title, req.body.body);
    let allNotes = notes.getAll();
    if (note) {
        req.flash('success_msg', 'Note added');
        res.redirect('/');
        notes.logNote(note);
    } else {
        req.flash('error_msg', 'Title already taken. Note not added. Try again');
        res.redirect('/');
    }
});
app.delete('/remove/:title', (req, res) => {
    let noteRemoved = notes.removeNote(req.params.title);
    let message = noteRemoved ? "Note successfully Removed" : 'Note not found';
    req.flash('success_msg', message);
    res.redirect('/');
});
app.listen(5000, () => {
    console.log('Server started on port 5000');
});