const keys = require('./paths');
const {logPath} = keys;
const mongoose = require('mongoose');
require('../models/player_logs');
const Player_Log = mongoose.model('player_logs');

module.exports = (app) => {
    app.get(logPath, (req, res) => {
    //     var page_num = parseInt(req.query.page_num),
    //     size = parseInt(req.query.size),
    //     query = {},
    //     response
    // if(page_num < 0 || page_num === 0){
    //        response = {"error": true, "msg": "invalid page number shoud start at 1?!"}
    //        return res.json(response);
    // }
    // query.skip = size * (page_num - 1);
    // query.limit = size;
    Player_Log.count({},function(err, count){

        Player_Log.find().then((logs) => {
            if(err) {
                response = {"error":true, "msg": "Error fetching data"}
            }
            var total_logs = Math.ceil(count);
            response = {"error": false, "data":logs, "total_logs":total_logs}
            res.json(response)
        }).catch((err) => {
            console.log(err)
        })
    })
 })

 app.get(logPath + '/:id', (req, res) => {
    Player_Log.findById(req.params.id).then((log) => {
        res.json({log})
    }).catch(err => console.log(err))
 })

}