const passport = require('passport')
const SuperUser = require('../models/super_user')
const keys = require('../routes/paths');
const {secret} = keys
const JwtStrategy = require('passport-jwt').Strategy
const UniqueTokenStrategy = require('passport-unique-token').Strategy;
const ExtractJwt  = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local');


const localOptions = {usernameField: 'user_name'}
const localLogin = new LocalStrategy(localOptions, function (user_name, password, done) {
       SuperUser.findOne({user_name: user_name}, function(err, user) {
            if(err) return done(err)
            if(!user) {
                return done(null, false)
            }
            console.log(password)
            user.comparePassword(password, function(err, isMatch){
                if(err) return done(err)
                if(!isMatch) return done(null, false)
                
                    return done(null, user)
            })
       })
})


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: secret
}

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
     SuperUser.findById(payload.sub, function(err, user) {
         if(err) return done(err, false)

         if(user){
                done(null, user)
         } else {
             done(null, false)
         }
     })
})

passport.use(jwtLogin)
passport.use(localLogin)