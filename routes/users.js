const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt =  require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');


// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg:'Failed to register user'});
        } else {
            res.json({success: true, msg: 'User registered'});
        }
    });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    //get user name and pw being submitted
    const username = req.body.username;
    const password = req.body.password;
    // get user by username  - used function created in user models

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        // if no user send response to client
        if(!user){
            return res.json({success: false, msg: 'User Not Found'});
        }

        // if user name exists , match password
        // comparePassword() function defined in user models.
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({data:user}, config.secret, {
                    expiresIn: 604800 // 1 week

                });

                // if password matches, send response
                res.json({
                    success: true, 
                    token: 'JWT '+token,
                    // user is from getUserByUserName
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
                // if password doesnt match, send fail response
            } else {
                return res.json({success: false, msg: 'Wrong Password'});
            }
        });

    });


});

// Profile 
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

// Validate
router.get('/validate', (req, res, next) => {
    res.send("VALIDATE");
});

module.exports = router