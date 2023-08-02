const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser'); // Import body-parser

// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use the body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// ...

app.get('/', (req, res) => {
  res.render('index', { lobbies });
});

app.post('/create-lobby', (req, res) => {
  const lobbyName = req.body.lobbyName; // Now req.body should be available
  const newLobby = { id: Date.now(), name: lobbyName, messages: [] };
  lobbies.push(newLobby);
  res.redirect('/');
});

// ...

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
