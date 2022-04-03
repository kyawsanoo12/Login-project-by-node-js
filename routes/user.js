const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user');
const passport = require('passport');


router.get('/login', (req, res) => {
    
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', (req, res) => {
    let errors = [];
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "please fill in the fields" });
    };
    if (password.length < 6) {
        errors.push({ msg: 'Password at least 6 Charators' });
    }
    if (password !== password2) {
        errors.push({ msg: "Password don't match!" });
    };
    if (errors.length > 0) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
        });
    } else {
        User.findOne({ email: email }, (err, user) => {
            if (user) {
                errors.push({ msg: "Email already have!" });
                res.render('register', {
                    errors: errors,
                    name: name,
                    email: email,
                    password: password,
                    password2: password2
                });
            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) return console.log(err);
                    if (salt) {
                        bcrypt.hash(password, salt).then((value) => {
                            newUser.password = value
                            newUser.save();
                            req.flash('success_msg', "You have successfully registered!");
                            res.redirect('/user/login');
                        }).catch(err => console.log(err));
                    }
                })
            };
        })
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash:true
}))

module.exports = router;