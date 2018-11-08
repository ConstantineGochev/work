const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PlayerLogsSchema = new Schema({
    op: {
        type: String
    },
    player_name: {
        type: String
    },
    prev_player_name: {
       type: String
    },
    player_balance: {
        type: Number
    },
    prev_player_balance: {
       type: Number
    },
    player_pass: {
        type: String
    },
    prev_player_pass: {
        type: String
    },
    player_id: {
        type: String
    },
    prev_player_id: {
       type: String
    },
    status: {type: String},
    prev_status:{type:String},
    created: {
        type: Date,
        default: Date.now()
    }
  
});

mongoose.model('player_logs', PlayerLogsSchema);