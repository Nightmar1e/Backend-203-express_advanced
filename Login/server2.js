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

app.listen(3000, () => console.log('http://localhost:3000'));