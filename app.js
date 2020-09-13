const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

const app = express();

//Passport config
require('./config/passport')(passport);

//Dotenv config
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//DB config
const db = process.env.MONGO_URI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(function() {
        console.log('Mongo DB connected...');
    })
    .catch(function(err) {
        console.log(err);
    });

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Body Parser
app.use(express.urlencoded({ extended: false }));

//Method override for PUT and DELETE
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash middleware
app.use(flash());

//Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/users'));

//Listening on localhost:3000 or environment variable PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`);
});