const express = require('express');
const flash = require('connect-flash');
const app = express();
require('dotenv').config();
const ejs = require('ejs');
const expressEjsLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/passport')(passport);
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Database connected!')).catch(err => console.log(err));

const indexRoute = require('./routes/index');
const userRoute = require('./routes/user');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname + 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized:true
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
app.use(passport.initialize());
app.use(passport.session());

app.use(expressEjsLayout);
app.use('/', indexRoute);
app.use('/user', userRoute);

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
});