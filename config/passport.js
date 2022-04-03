const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email: email }).exec((err, user) => {
            if (!user) {
                return done(null, false, { message: 'Have not that email.if have not email,please registered!' });
            } else {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        done(null, user);
                    } else {
                        done(null, false, { message: "Password incorrect!" });
                    }
                });
            }
           
        })
    }));
    passport.serializeUser((user,done)=>done(null,user));
    passport.deserializeUser((id, done) => {
        User.findById(id).exec((err, res) => {
            if (err) throw err;
            if (res) {
                done(null, res);
            }
        })
    });
}