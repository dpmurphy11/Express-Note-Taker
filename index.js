// const fs = require('fs');
const express = require('express');
const path = require('path');
// const api = require('../  ./routes/index.js');
const api = require('./routes/index');
const notesData = require('./db/db.json');
const db = './db/db.json';

const app = express();
const PORT = process.env.port || 3001;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', api);

// expose all file in public dir
app.use(express.static('public'));

// const readAndAppend = (content, file) => {
//   fs.readFile(file, 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//     } else {
//       const parsedData = JSON.parse(data);
//       parsedData.push(content);
//       writeToFile(file, parsedData);
//       // fs.writeFile(file, JSON.stringify(parsedData, null, 4), err => {
//       //   err ? console.error(err) : console.info(`\nData written to ${file}`)
//       });
//     }
//   });
// };


app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// fallback route
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT);
