const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create schema
const SessionSchema = new Schema({
    session_id: {
       type: String
    },
    user: [{type: Schema.Types.ObjectId, ref: 'user'}],
    transactions: [{type: Schema.Types.ObjectId, ref: 'transaction'}],
    created: {
        type: Date,
        default: Date.now()
    }
  
});

mongoose.model('session', SessionSchema);