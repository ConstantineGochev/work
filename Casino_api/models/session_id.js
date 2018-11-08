const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const sessionIDschema = new Schema({
   session_id: {
       type: String
   }
});

mongoose.model('session_ids', sessionIDschema);