const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create schema
const userSchema = new Schema({
    player_id: {
        type: Number,
        unique: true       
    },
    screenname: {
        type: String,      
    },
    password: {
        type:String,       
    },
    balance: {
        type: Number,
    },
    banned: {
        type: String,
        default: 'active'
    },
    uniqueToken: {
       type: String
    },
    requests: [{type: Schema.Types.ObjectId, ref: 'transaction'}],
    settings: {type: Schema.Types.Mixed,
               default: {}},
    settings_continue: {type: Schema.Types.Mixed,
        default: {}
    },
    settings_cancel: {
        type: Schema.Types.Mixed,
        default: {}
    },         
    created: {
        type: Date,
        default: Date.now()
    }
},{minimize: false});

mongoose.model('user', userSchema);