if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  
  const express = require('express');
  const app = express();
  const bcrypt = require('bcrypt');
  const passport = require('passport');
  const flash = require('express-flash');
  const session = require('express-session');
  const methodOverride = require('method-override');
  const mongoose = require('mongoose'); // Import Mongoose
  const routes = require('./routes'); // Import the routes from the routes.js

  
  const Message = require('./models/message'); // Replace './models/message' with the actual path to your message.js file

  // Assuming you already established a MongoDB connection using mongoose.connect()
  
  // Find and display all documents in the "messages" collection
  // Message.find({})
  // .then((messages) => {
  //   console.log('All messages:', messages);
  // })
  // .catch((error) => {
  //   console.error('Error fetching messages:', error);
  // });;

  async function getAllMessages() {
    try {
      const messages = await Message.find();
      console.log('All messages:', messages);
    } catch (err) {
      console.error('Error retrieving messages:', err);
    }
  }
  getAllMessages();
  // to get 10 last only
  // async function getLast10Messages() {
  //   try {
  //     const messages = await Message.find().sort({ timestamp: -1 }).limit(10);
  //     console.log('Last 10 messages:', messages);
  //   } catch (err) {
  //     console.error('Error retrieving last 10 messages:', err);
  //   }
  // }
  
  // getLast10Messages();




  // const initializePassport = require('./passport-config.js');
  // initializePassport(
  //   passport,
  //   email => User.findOne({ email: email }), // Use Mongoose to find user by email
  //   id => User.findById(id) // Use Mongoose to find user by ID
  // );
  
// Connect to the database
connectToDatabase();
async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/myapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to the database. 😌');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
}

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Import the routes from the routes.js file
app.use(routes);

// const message1 = new Message({ name: 'John Doe', content: 'Hello, how are you?' });
// const message2 = new Message({ name: 'Alice', content: 'Hi there!' });

// Inserting messages into MongoDB using promises
// message1.save()
//   .then(savedMessage1 => {
//     console.log('Message 1 saved successfully:', savedMessage1);
//   })
//   .catch(err => {
//     console.error('Error saving message 1:', err);
//   });

// message2.save()
//   .then(savedMessage2 => {
//     console.log('Message 2 saved successfully:', savedMessage2);
//   })
//   .catch(err => {
//     console.error('Error saving message 2:', err);
//   });



app.listen(3000, () => console.log('http://localhost:3000'));