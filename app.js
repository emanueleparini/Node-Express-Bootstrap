const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/note')
.then(() => console.log('Server connected'))
.catch(err => console.log(err));

// Schema
require('./models/note');
const Note = mongoose.model('note');

// Handlebars
app.set('view engine', 'hbs');
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: "main"}));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ruote
app.get('/', (req, res)=>{
    Note.find({})
    .lean()
    .sort({date:'desc'})
    .then(note => {
        res.render('index', {note: note});
    });
    //res.render('index', {title: title});
});

app.get('/add', (req, res)=>{
    res.render('add');
});

app.post('/add', (req, res)=>{
    let err = [];
    if(!req.body.title){
        err.push({text:'Please put a Title'})
    }
    if(!req.body.text){
        err.push({text:'Please put a Text'})
    }
    if(err.length>0){
        res.render('add', {
            err: err,
            title: req.body.title,
            text: req.body.text
        })
    }else{
        const newNote = {
            title: req.body.title,
            text: req.body.text
        }
        new Note(newNote)
        .save()
        .then(note => {
            res.redirect('/');
        })
    }
});

app.get('/edit/:id', (req, res)=>{
    Note.findOne({ _id: req.params.id })
    .lean()
    .then(nota=>{
        res.render('edit', {
            nota: nota
        })
    });
});

app.get('/about', (req, res)=>{
    res.render('about');
});

app.listen(port, function(){
    console.log(`Server working on port ${port}`);
});