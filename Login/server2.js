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
  
  // const initializePassport = require('./passport-config.js');
  // initializePassport(
  //   passport,
  //   email => User.findOne({ email: email }), // Use Mongoose to find user by email
  //   id => User.findById(id) // Use Mongoose to find user by ID
  // );
  
  // Mongoose User schema
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  
  const User = mongoose.model('User', userSchema);

  const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
  });
  
  const Message = mongoose.model('Message', messageSchema);

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
  
  app.get('/', async (req, res) => {
    try {
      const messages = await Message.find({});
      res.render('index.ejs', { name: req.user.name, messages: messages });
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
  
  // app.delete('/logout', (req, res) => {
  //   console.log('Logout route called!');
  //   req.logOut();
  //   res.redirect('/login');
  // });
  



  // function checkAuthenticated(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     return next();
  //   }
  
  //   res.redirect('/login');
  // }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
  }
  
  app.listen(3000, () => console.log('http://localhost:3000'))
  