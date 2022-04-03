const express = require('express');
const router = express.Router();
const checkAuthentication = require('../config/auth').checkAuthentication;

router.get('/', (req, res) => {
    res.render('welcome');
});

router.get('/dashboard', checkAuthentication,(req, res) => {
    res.render('dashboard');
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', "Now,You have logout!");
    res.redirect('/user/login');
})

module.exports = router;