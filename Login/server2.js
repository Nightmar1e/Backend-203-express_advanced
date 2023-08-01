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
  
  const initializePassport = require('./passport-config.js');
  initializePassport(
    passport,
    email => User.findOne({ email: email }), // Use Mongoose to find user by email
    id => User.findById(id) // Use Mongoose to find user by ID
  );
  
  // Mongoose User schema
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  
  const User = mongoose.model('User', userSchema);
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const users = [];
  
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
  
  app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user });
  });
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
  });
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));
  
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
      await newUser.save(); // Save the new user to MongoDB
      res.redirect('/login');
    } catch {
      res.redirect('/register');
    }
  });
  
  // app.delete('/logout', (req, res) => {
  //   console.log('Logout route called!');
  //   req.logOut();
  //   res.redirect('/login');
  // });
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    res.redirect('/login');
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
  }
  
  app.listen(3005);
  