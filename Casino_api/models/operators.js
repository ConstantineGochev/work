const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create schema
const OperatorsSchema = new Schema({
 operator_name: {
   type: String
 },
ip_adress: {
    type: String
},
name: {
    type: String
},
pass: {
    type: String
},
portal_code: {
    type: String
},
url: {
    type: String
},
created: {
    type: Date,
    default: Date.now()
}
  
});

mongoose.model('operators', OperatorsSchema);