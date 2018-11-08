const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create schema
const TransactionSchema = new Schema({
    op: {
        type: String,
    },
    err_code: {
       type: String
    },
    transfer_id: {
       type: String
    },
    session_id: {
        type: String
    },
    reason: {
        type: String
    },
    msg: {
        type: String
    },
    amount: {
        type: Number
    },
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    created: {
        type: String
    },
    hour: {
        type: String
    }
});



mongoose.model('transaction', TransactionSchema);

