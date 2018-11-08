const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const defCodeSchema = new Schema({
   def_code: {
       type: String
   },
   session_id: {
       type: String
   },
   player_id: {
        type: String
    },
   portal_code: {
       type: String
   }
});

mongoose.model('def_codes', defCodeSchema);