const express = require('express');
const router = require('express').Router();
const uuid = require('uuid');
const { readFromFile, readAndAppend, readAndRemove } = require('../helpers/fsUtils');
const notesData = require('../db/db.json');
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

    // Iterate through the notes id to check if it matches `req.params.id`
    for (let i = 0; i < notesData.length; i++) {
        if (requestedId === notesData[i].id) {
            readAndRemove(notesData[i], db);
            res.json('Note removed successfully.');
        }
    }
});

module.exports = app;
