const JwstStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports = function(passport) {
    // create empty options object
    let opts = {};
    // add to options object  the jwt token from the authorization header FIX: ..WithScheme('jwt')
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;

    // pass in options and get payloadw
    passport.use(new JwstStrategy(opts, (jwt_payload, done) => {
        User.getUserById(jwt_payload.data._id, (err,user) => {
            if(err) {
                return done(err, false);
            }

            if(user){
                return done(null,user);

            } else {
                return done(null,false);
            }
        })
    }));
}