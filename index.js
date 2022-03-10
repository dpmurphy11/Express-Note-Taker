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

const readAndRemove = (content, file) => {
  // read json file, delete object from file, write file
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      let arrNew = parsedData.filter((item) => item.id !== content.id);
      fs.writeFile(file, JSON.stringify(arrNew, null, 4), err => {
        err ? console.error(err) : console.info(`\nData deleted from ${file}`)
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
      console.log('data to append' + parsedData)
      parsedData.push(content);
      fs.writeFile(file, JSON.stringify(parsedData, null, 4), err => {
        err ? console.error(err) : console.info(`\nData written to ${file}`)
      });
    }
  });
};

app.get('/api/notes', (req, res) => {
  fs.readFile(db, 'utf-8', (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid.v4(),
    };

    readAndAppend(newNote, db);
    res.json(`Note added successfully `);
  } else {
    res.error('Error in adding tip');
  }
});

app.delete('/api/notes/:id', (req, res) => {

  //get the note id from query param
  const requestedId = req.params.id;

  // Iterate through the notes id to check if it matches `req.params.id`
  for (let i = 0; i < notesData.length; i++) {
    if (requestedId === notesData[i].id) {
      readAndRemove(notesData[i], db), err => {
        err ? console.error(err) : console.info(`\nData deleted from ${file}`)
      }
    }
  }
});

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// fallback route
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT);
