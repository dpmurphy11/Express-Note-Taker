const express = require('express');
// const router = require('express').Router();
const uuid = require('uuid');
const { writeToFile, readFromFile, readAndAppend } = require('../helpers/fsUtils');
// const notesData = require('../db/db.json');
const db = './db/db.json';

const app = express();

app.get('/notes', (req, res) => {
    readFromFile(db).then((data) => res.json(JSON.parse(data)));
});

app.post('/notes', (req, res) => {
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
        res.error('Error in adding note.');
    }
});

app.delete('/notes/:id', (req, res) => {

    //get the note id from query param
    const requestedId = req.params.id;

    readFromFile(db)
    .then((data) => JSON.parse(data))
    .then((json) => {
      let retJSON = json.filter((note) => note.id !== requestedId);
      writeToFile('./db/db.json', retJSON);
      res.json('Note deleted successfully');
    });
});

module.exports = app;
