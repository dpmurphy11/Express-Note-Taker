const fs = require('fs');
const express = require('express');
const path = require('path');
const uuid = require('uuid');
// const util = require('util');
const notesData = require('./db/db.json');
const db = './db/db.json';

const app = express();
const PORT = process.env.port || 3001;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// expose all file in public dir
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  fs.readFile(db, 'utf-8', (err, data) => {
    res.json(notesData);
  });
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      noteId: uuid.v4(),
    };

    readAndAppend(newNote, db);
    res.json(`Note added successfully `);
  } else {
    res.error('Error in adding tip');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const { title, text } = req.body;

  if (req.body) {
    const thisNote = {
      title,
      text,
      noteId: req.query
    };

    readAndRemove(thisNote, db);
    res.json(`Note deleted successfully `);
  } else {
    res.error('Error in adding tip');
  }
});

const readAndRemove = (content, file) => {
  console.log(content);
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.pop(content);
      fs.writeFile(file, JSON.stringify(parsedData, null, 4), err => {
        err ? console.error(err) : console.info(`\nData written to ${file}`)
      });
    }
  });
};

const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      fs.writeFile(file, JSON.stringify(parsedData, null, 4), err => {
        err ? console.error(err) : console.info(`\nData written to ${file}`)
      });
    }
  });
};


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// fallback route
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT);
