const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create schema
const GamesSchema = new Schema({
  game_name: {
      type: String
  },
  sort_number: {
      type: Number
  },
  game_id: {
      type: Number
  },
  game_type: {
      type: String
  },
 operator: {
     type: [{type: Schema.Types.ObjectId, ref: 'operators'}]
 }
  
});

mongoose.model('games', GamesSchema);