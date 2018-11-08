const keys = require('./paths');
const jwt = require('jwt-simple')
const {playersPath, mainPath, secret} = keys;
const helpers = require('../config/helpers')
const {save_player_logs} = helpers;
const mongoose = require('mongoose');
require('../models/user');
const Player = mongoose.model('user');
const SuperUser = require('../models/super_user')
const passportService = require('../services/passport')
const passport = require('passport')
//const bcrypt = require('bcrypt')


const RequireAuth = passport.authenticate('jwt', {session: false});
const RequireSignin = passport.authenticate('local', {session: false})



function token_for_user (user) {
    const timestamp = new Date().getTime(); 
       return jwt.encode({sub: user.id, iat: timestamp}, secret)
}


module.exports = (app, UserCollection) => {

    app.get(playersPath, (req, res)=>{
        // var page_num = parseInt(req.query.page_num),
        // size = parseInt(req.query.size),
        // query = {},
        // response
        // if(page_num < 0 || page_num === 0){
        //     response = {"error": true, "msg": "invalid page number shoud start at 1?!"}
        //     return res.json(response);
        //   }
        //   query.skip = size * (page_num - 1);
        //   query.limit = size;
        Player.count({}, function(err, count){

            Player.find().populate('requests').then((users) => {
                if(err) {
                    response = {"error":true, "msg": "Error fetching data"}
                }
                var total_users = Math.ceil(count);
                response = {"error": false, "data":users, "total_users":total_users}
                res.json(response)
            }).catch((err) => {
                console.log(err)
            })
        })

    })
    app.get(playersPath + '/:id', (req, res) => {
        Player.findById({_id: req.params.id}).populate('requests').then((player) =>{
            res.json({"player": player})
        }).catch((err)=>console.log(err))
    })
    app.get(playersPath + '/for_filter/:screenname', (req, res) => {
        Player.find({screenname: req.params.screenname}).then((player) => {
            console.log(player)
            res.json({"player": player})
        }).catch((err) => console.log(err))
    })
    // app.get(mainPath + '/games/:id', (req, res) => {
    //     Game.find({game_id: req.params.id}).then(game => {
    //         res.json({game})
    //     }).catch(err => console.log(err))
    // })




    app.post(playersPath,   (req,res) => {
            console.log('player from the form ==========  ')
            //console.log(req.body)
            console.log('-------------------')
        var new_user;
        const continue_settings = {'withdr':{'code':1000, 'msg': 'OK'},'deposit':{'code':1000, 'msg': 'OK'}}
        const cancel_settings = {'deposit':{'code':1000, 'msg': 'OK'}}
        var default_settings = {'auth':{'code': 1000, 'msg':'OK'},'withdr':{'code':1000, 'msg': 'OK'},'deposit':{'code':1000, 'msg': 'OK'}}



      //UserCollection.count({player_id: req.body.player_id},(err, count) => {
          // console.log(count)
            // if(count > 0) {
            //      return res.json({success: false, msg: 'User ID exists'})
            //     console.log(user)
            // } else {
            new_user = new Player({
            player_id: req.body.player_id,
            screenname:req.body.screenname,
            password: req.body.password,
            settings: default_settings,
            settings_continue: continue_settings,
            settings_cancel: cancel_settings,
            balance: req.body.balance,
            banned: req.body.banned
        });

                new_user.save().then((user, err) => {
                    if(err) return res.status(500).send('there was a problem in db...')

                 
                   save_player_logs('Player created',{screenname: new_user.screenname})
                   res.json({succes: true, msg: 'User registered', user: new_user})
               
               }).catch((err) => {
                   res.json({success: false, msg: 'User ID exists'})
                   console.log(err)
                })
        //    }
       // })

    })

    app.put(playersPath + '/:id', (req, res) => {
        var old_cred = {}
        var new_cred = {}
        Player.findOne({ _id: req.params.id })
            .then((prev_player) => {
                // console.log('old balance === %s ', user.balance)
                // console.log('new balance ==== %s ', req.body.balance)
                // console.log(user)
                // console.log('==============')
                // console.log(req.body)
                //console.log(user)
                const { player_id, screenname, password, balance, banned } = prev_player
                old_cred = { player_id, screenname, password, balance, banned }

                prev_player.player_id = req.body.player_id,
                    prev_player.screenname = req.body.screenname,
                    prev_player.password = req.body.password,
                    prev_player.balance = req.body.balance,
                    prev_player.banned = req.body.banned
                prev_player.save()
                    .then((new_player) => {
                        const { player_id, screenname, password, balance, banned } = new_player
                        new_cred = { player_id, screenname, password, balance, banned }

                        res.send({ msg: 'User updated', new_player })
                        save_player_logs('Player data changed', new_cred, old_cred)
                    }).catch((err) => {
                        return res.send({ msg: 'Player ID exists' })
                    })
            }).catch((err) => {
                return res.send({ msg: 'Player ID exists' })

            })
    })
   

    app.delete(playersPath + '/:id', (req, res) => {
        Player.findOneAndRemove({_id:req.params.id})
        .then((user, err) => {
            if(err) return res.send({msg: 'error in db...'})
            save_player_logs('Player deleted',{screenname:user.screenname})
            res.send({msg: 'User deleted', user})

        }).catch((err) => {
            console.log(err);
        })
    })


     app.get(mainPath +'/current', (req, res) => {
        console.log(req.query)
        var {screenname, password} = req.query;
        Player.findOne({screenname,
            password
             }).then(user => {
                if(!user){
                    return res.send({'msg': 'User not found'})
                 }

                  res.send({'user': user})
                 }).catch(err => {
                     console.log(err)
               })

     })


    // SUPER USERSS =================================
    app.post('/signup', function(req, res, next) {
        const { user_name, password } = req.body
        console.log(req.body)
        if(!user_name || !password) {
            return res.status(422).send({error: 'You must provide username and password.'})
        }

        SuperUser.findOne({user_name: user_name}, function(err, existingUser) {
             if(err) return next(err)

             if(existingUser) {
                return res.status(422).send({error: 'Username is in use.'})
             }

             const user = new SuperUser({
                 user_name,
                 password
             })
            user.save(function(err) {
                if(err) return next(err)

                res.json({token: token_for_user(user)})
            })


        })

    })
    app.post('/signin', RequireSignin, (req, res, next ) => {
        console.log(req.user)
          res.send({token: token_for_user(req.user), user_name: req.user.user_name})
    })


}
