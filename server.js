const express = require('express');
const path = require('path');
const api = require('./routes/index');

const app = express();
const PORT = process.env.port || 5000;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', api);

// expose all file in public dir
app.use(express.static('public'));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// fallback route
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, "0.0.0.0", () => console.log(`Listening on Port: ${PORT}`));
// app.listen(PORT);
