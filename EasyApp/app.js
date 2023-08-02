const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());

// MongoDB setup
const { MongoClient, ObjectId } = require('mongodb');
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'message_lobby_app';

MongoClient.connect(mongoURL, (err, client) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    return;
  }

  console.log('Connected to MongoDB');
  const db = client.db(dbName);

  // User registration route
  app.post('/signup', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.collection('users').insertOne({ name, email, password: hashedPassword });

      res.json({ message: 'User registered successfully' });
    } catch (err) {
      console.error('Error in user registration:', err);
      res.status(500).json({ error: 'Failed to register user' });
    }
  });

  // User login route
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await db.collection('users').findOne({ email });

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      res.json({ message: 'Logged in successfully' });
    } catch (err) {
      console.error('Error in user login:', err);
      res.status(500).json({ error: 'Failed to log in' });
    }
  });

  // Create a new lobby route
  app.post('/lobby', async (req, res) => {
    try {
      const { name } = req.body;

      await db.collection('lobbies').insertOne({ name });

      res.json({ message: 'Lobby created successfully' });
    } catch (err) {
      console.error('Error in creating lobby:', err);
      res.status(500).json({ error: 'Failed to create lobby' });
    }
  });

  // View lobbies route
  app.get('/lobby', async (req, res) => {
    try {
      const lobbies = await db.collection('lobbies').find({}).toArray();

      res.json({ lobbies });
    } catch (err) {
      console.error('Error in fetching lobbies:', err);
      res.status(500).json({ error: 'Failed to fetch lobbies' });
    }
  });

  // Post a message route
  app.post('/lobby/:lobbyId/message', async (req, res) => {
    try {
      const { lobbyId } = req.params;
      const { content } = req.body;

      const message = {
        lobby: new ObjectId(lobbyId),
        content,
      };

      await db.collection('messages').insertOne(message);

      res.json({ message: 'Message posted successfully' });
    } catch (err) {
      console.error('Error in posting message:', err);
      res.status(500).json({ error: 'Failed to post message' });
    }
  });

  // View messages in a lobby route
  app.get('/lobby/:lobbyId/message', async (req, res) => {
    try {
      const { lobbyId } = req.params;

      const messages = await db.collection('messages').find({ lobby: new ObjectId(lobbyId) }).toArray();

      res.json({ messages });
    } catch (err) {
      console.error('Error in fetching messages:', err);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  // Edit a message route
  app.put('/lobby/:lobbyId/message/:messageId', async (req, res) => {
    try {
      const { lobbyId, messageId } = req.params;
      const { content } = req.body;

      const message = await db.collection('messages').findOne({ _id: new ObjectId(messageId) });

      if (!message) {
        res.status(404).json({ error: 'Message not found' });
        return;
      }

      await db.collection('messages').updateOne({ _id: new ObjectId(messageId) }, { $set: { content } });

      res.json({ message: 'Message updated successfully' });
    } catch (err) {
      console.error('Error in updating message:', err);
      res.status(500).json({ error: 'Failed to update message' });
    }
  });
  app.listen(3001);
});
