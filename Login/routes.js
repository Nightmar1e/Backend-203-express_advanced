const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose'); // Import Mongoose
const User = require('./models/user.js'); // Import Mongoose User model
const Message = require('./models/message'); // Import Mongoose Message model

// ... (other route-specific code)
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  });
  

//
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
  }

// Define routes here
app.get('/', async (req, res) => {
    try {
      if (req.isAuthenticated()) {
        const messages = await Message.find({});
        res.render('index.ejs', { name: req.user.name, messages: messages });
      } else {
        res.redirect('/login');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      res.redirect('/');
    }
  });

  
  app.get('/login', (req, res) => {
    res.render('login.ejs');
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email in the database
      const user = await User.findOne({ email });
  
      if (!user) {
        // If the user does not exist, show an error flash message and redirect to /login, NO PUEEDO
        req.flash('error', 'No user with that email!');
        return res.redirect('/login');
      }
  
      // Check the password using bcrypt compare
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
      if (!isPasswordCorrect) {
        // If the password is incorrect, show an error flash message and redirect to /login, PERDON
        req.flash('error', 'Incorrect password');
        return res.redirect('/login');
      }
  
      // If both email and password are correct, log the user in, DISCULPE
      req.logIn(user, (err) => {
        if (err) {
          console.error('Error logging in the user:', err);
          return res.redirect('/login');
        }
        console.log('User logged in:', user);
        return res.redirect('/');
      });
    } catch (error) {
      // Catch any unexpected errors and log them
      console.error('Unexpected error during login:', error);
      res.redirect('/login');
    }
  });
  


  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
  });
  
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      await newUser.save(); 
      res.redirect('/login');
    } catch {
      res.redirect('/register');
    }
  });
// ... (other routes)

module.exports = app;
