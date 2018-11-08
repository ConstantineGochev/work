const keys = require('./paths');
const { mainPath} = keys;
// import mainPath from './paths'
const mongoose = require('mongoose')
require('../models/games');
require('../models/operators');
const Operators = mongoose.model('operators')
const Game = mongoose.model('games')
const ObjectID = require('mongodb').ObjectID


module.exports = (app, GamesCollection) => {
    app.get(mainPath + '/games', (req, res) => {
        Game.find().sort({"sort_number": 1}).populate('operator').then((games) => {
            res.send({"games":games})
        }).catch((err) => console.log(err))
    })
    app.post(mainPath + '/games', (req, res) => {
         
        const {game_id, game_type, operator, game_name, game_index} = req.body

        const game = new Game({
            game_name,
            game_index,
            game_id,
            game_type,
            operator,
            sort_number:0

        })
        console.log(game)
        game.save().then((game) => {
            res.send({"msg": 'Game created'})
        }).catch((err) => res.json({"msg": "Some error occured in db"}))
    })
    //order of games 
    app.put(mainPath + '/games/', (req, res) => {       
       req.body.sorted.map((item) => {
            Game.findOne({game_id: item.game_id})
            .then((game) => {
                game.sort_number = item.sort_number
                game.save()
            }).catch((err) => console.log(err))
        })
    })
    app.put(mainPath + '/games/:id', (req, res) => {

         Game.findOne({_id: req.params.id})
        .then((game) => {
            game.game_name = req.body.game_name,
            game.game_id = req.body.game_id,
            game.game_type = req.body.game_type,
            game.operator = req.body.operator,
         
            game.save()
            .then((game) => {
                
                res.send({msg: 'Game updated', game})
            }).catch((err) => {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
        })
    
    })
    app.delete(mainPath + '/games/:id', (req, res) => {
        Game.remove({_id:req.params.id})
        .then((game) => {
           console.log(game)
            res.send({msg: 'Game deleted', game})

        }).catch((err) => {
            console.log(err);
        })
    })
    // OPERATORS REQUESTS

    app.get(mainPath + '/operators', (req, res) => {
        Operators.find({}).then((operators) => {
            res.send({"operators": operators})
        }).catch((err) => console.log(err))
    })

    app.put(mainPath + '/operators/:id', (req, res) => {

        Operators.findOne({_id: req.params.id})
       .then((operator) => {
        operator.ip_adress = req.body.ip_adress,
        operator.name = req.body.name,
        operator.operator_name = req.body.operator_name,
        operator.pass = req.body.pass,
        operator.portal_code = req.body.portal_code
        
        operator.save()
           .then((operator) => {
               
               res.send({msg: 'operator updated', operator})
           }).catch((err) => {
               console.log(err)
           })
       }).catch((err) => {
           console.log(err)
       })
   
   })

    app.post(mainPath + '/operators', (req, res) => {
        const {operator_name, ip_adress, name, pass, portal_code} = req.body
        const operator = new Operators({
          operator_name,
          ip_adress,
          name,
          pass,
          portal_code,
          url: `${mainPath}/${operator_name}`
        })
      operator.save().then((operator)=> {
          res.send({"msg": "Operator created"})
      }).catch((err) => res.send({"msg": " Some error occured in db"}))
    })

    app.delete(mainPath + '/operators/:id', (req, res) => {
        Operators.remove({_id:req.params.id})
                 .then((operator) => {
                     console.log(operator)
                     res.send({msg: 'Operator deleted', operator})
                 }).catch(err => console.log(err))
    })
    app.get(mainPath + '/operators/:id', (req, res) => {
        Operators.findOne({_id: req.params.id}).then((operator) => {
            console.log(operator)
            res.send({'operator': operator})
        }).catch(err => console.log(err))
    })
}