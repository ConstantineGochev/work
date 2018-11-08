const {SHA256} = require('crypto-js');
const mongoose = require('mongoose');
require('../models/transactions');
require('../models/player_logs');
require('../models/defcode');
require('../models/transfer_id');
require('../models/session_id');
require('../models/user');


const Player_Log = mongoose.model('player_logs');
const Transaction = mongoose.model('transaction');
const DefenceCode = mongoose.model('def_codes');
const TransferID = mongoose.model('transfer_ids')
const SessionID = mongoose.model('session_ids');
const User = mongoose.model('user');
const xml2js = require('xml2js');
var builder = new xml2js.Builder();
const async = require('async')


var obj = {
    // send back xml reply
send_reply: (json, res,token) => {
    
    var xml_reply = builder.buildObject(json);

     res.send(xml_reply)
},
 

//save transfer id to db 
save_codes: async (type,obj) =>{
    var new_code;
    switch (type) {
        case 'Defence_code':
            try {
                new_code = await new DefenceCode({ def_code: obj.code, player_id: obj.player_id, portal_code: obj.portal_code });
                await new_code.save()
            } catch (err) {
                console.log(err)
            }

            break;
        case 'Transfer_code':
            new_code = await new TransferID({ transfer_id: obj.code });
            try {
                await new_code.save()

            } catch (err) {
                console.log(err)
            }
            break;
        // case 'Session_id':
        // new_code = await new SessionID({session_id: code});
        //  try{
        //       await new_code.save()
        // }catch(err){
        //       console.log(err)
        //  }
        //     break;
        default:
            break;
    }

 
},
//test if codes exist in DB hihi
test_codes: function(type,callback) {

    var code = gen_rand_code()
    switch (type) {
      case 'Defence_code':
          //var code = '41a1698a20dd701a5a66fb5b33e44fd8408d1e46e0f8c772354c94f372e5483f'
          DefenceCode.findOne({def_code: code},(err, res) =>{
            //   console.log(res)
            //   console.log('err == %s',err)
              if(res === null) {
                 callback(code)
              } else{
                 console.log('in else')
                 obj.test_codes(type,callback);
              } 
          })   
           break;
      case 'Transfer_code':
          TransferID.findOne({transfer_id: code},(err, res) =>{
            //   console.log(res)
            //   console.log('err == %s',err)
              if(res === null) {
                 callback(code)
              } else{
                 console.log('in else')
                 obj.test_codes(type,callback);
              } 
          })  
          
            break;
    //   case 'Session_id':
    //        SessionID.findOne({session_id: code},(err, res) =>{
    //         //   console.log(res)
    //         //   console.log('err == %s',err)
    //           if(res === null) {
    //              callback(code)
    //           } else{
    //              console.log('in else')
    //              obj.test_codes(type,callback);
    //           } 
    //       }) 
    //         break;
        default:
           console.log('Ooops something went wrong in default')
            break;
    }
},

//save successful transactions into db
save_player_req:(id,request) =>{
    console.log('id from save player req ===== %s ', id)
    User.findById(id)
    .then((user) => {
      //  console.log('user from save player req ===== %s ',user)
        user.requests.push(request)
        Promise.all([user.save(),request.save()]).then(() =>{
            console.log('user and request saved ?')
        }).catch((err) => {
            console.log('ooops something went wrong: %s',err)
        })
    })
    .catch((err) => {
        console.log(err)
    })
},

//save empty transaction into db
save_empty_req:(op,err_code,msg,amount,transfer_id,user) =>{
    var transaction = new Transaction({op,err_code,transfer_id,amount,msg,user})
    transaction.save().then(() => {
           console.log('transaction saved,')
    }).catch((err) => {
        console.log(err)
    })
},

//save player logs
save_player_logs:(op,new_params_obj, old_params_obj) =>{
    console.log(op)
    console.log('=====')
    console.log(new_params_obj)
    console.log('===========================')
    //console.log(old_params_obj)
    var log;
    if (old_params_obj === undefined) {
        log = new Player_Log({ op, player_name: new_params_obj.screenname })
    } else {
        log = new Player_Log({
            op,
            player_name: new_params_obj.screenname,
            prev_player_name: old_params_obj.screenname,
            player_balance: new_params_obj.balance,
            prev_player_balance: old_params_obj.balance,
            player_pass: new_params_obj.password,
            prev_player_pass: old_params_obj.password,
            player_id: new_params_obj.player_id,
            prev_player_id: old_params_obj.player_id,
            status: new_params_obj.banned,
            prev_status: old_params_obj.banned
        })
    }
    log.save().then(() => {
        console.log('Player log saved')
    }).catch((err) => {
        console.log(err)
    })
},


//get user with certain player_id
get_user:(collection,id,cb) =>{
    var found_user_id;
    collection.find().forEach(function(user){
        if(id == /* !! do not use === */ user.player_id) {
          //  console.log("==== found user: %s", JSON.stringify(user));
            found_user_id = user
        }
            //here item is record. ie. what you have to do with each record.
        }, function(err){
            if(err){
                console.log(err)
            }
            cb(found_user_id)
        })
},

//make a bet 
user_bet: (collection, id, bet,balance,callback) =>{

       collection.update({player_id: id}, {$set:{"balance": balance - bet}}, function(err, result){
           debugger
           console.log('------- withdraw --------')
           if(err) {
               console.log(err)
           }
             User.find({player_id: id},function(err, user){
                 console.log('------------------ User in bet --------------------')
                 console.log(user[0].balance)
                 callback(user[0].balance)
             })
              // console.log(result)
           console.log('------- withdraw --------')
            
       })
    // collection.update({"player_id": id}, {$set:{"balance": balance - bet}}, function(err, result){
    //     if (err) {
    //         console.log('Error updating object: ' + err);
    //     } else {
        
    //        var user_found = null;
          
    //        collection.find().forEach(function(user){
    //            //  console.log(user.player_id)
    //            if(user.player_id == op.PlayerId[0]){
    //               user_found = user
                         
    //           } 
    //       }, function(err) {
              
    //          // console.log('' + result + ' document(s) updated');
    //           var reply =  {
    //             'WithdrawResponse': {
    //                 'Balance': user_found.balance,
    //                 'ErrorCode': 1000,
    //                 'CasinoTransferId': transfer_id,
    //                 'ErrorMessage': 'OK',
    //                 'TotalBet': bet,
    //                 'TotalWin': 400,
    //                 'PlayTime': 2,
    //             }
    //         };
    //           cb(reply,res) 
    //       })
    //     }
    // });
  },

//make a deposit
  user_deposit:(collection, id, deposit,balance,callback) =>{
    collection.update({player_id: id}, {$set:{"balance": balance + Number(deposit)}}, function(err, result){
           debugger
           console.log('------- deposit --------')
           if(err) {
               console.log(err)
           }
             User.find({player_id: id},function(err, user){
                 console.log('------------------ User in deposit --------------------')
                 console.log(user[0].balance)
                 callback(user[0].balance)
             })
              // console.log(result)
           console.log('------- deposit --------')
            
       })

    
    // collection.update({"player_id": id}, {$set:{"balance": balance + deposit}}, function(err, result){
    //     if (err) {
    //         console.log('Error updating object: ' + err);
    //     } else {
        
    //        var user_found = null;
          
    //        collection.find().forEach(function(user){
    //            //  console.log(user.player_id)
    //            if(user.player_id == op.PlayerId[0]){
    //               user_found = user
                         
    //           } 
    //       }, function(err) {
    //           var reply;
    //          console.log('' + result + ' document(s) updated');
    //         if(op_type == 'dr'){
    //                reply =  {
    //                'DepositResponse': {
    //                    'Balance': user_found.balance,
    //                    'ErrorCode': 1000,
    //                    'CasinoTransferId': transfer_id,
    //                    'ErrorMessage': 'OK',
    //                    'TotalDeposit': deposit,
    //                    'TotalWin': 400,
    //                    'PlayTime': 2,
    //                }
    //            };       
    //         }else if(op_type == 'rr'){
    //             reply =  {
    //                 'RefundResponse': {
    //                     'Balance': user_found.balance,
    //                     'ErrorCode': 1000,
    //                     'CasinoTransferId': transfer_id,
    //                     'ErrorMessage': 'OK',
    //                     'TotalDeposit': deposit,
    //                     'TotalWin': 400,
    //                     'PlayTime': 2,
    //                 }
    //             };   
    //          }
    //           cb(reply,res) 
    //       })
    //     }
    // });
  },

  //withdraw and deposit
  withdraw_deposit:(collection, id,transfer_id, deposit,bet,balance,res,op,cb) =>{
      var a = deposit - bet;
      console.log(a)
    collection.update({"player_id": id}, {$set:{"balance": balance + (a)}}, function(err, result){
        if (err) {
            console.log('Error updating object: ' + err);
        } else {
        
           var user_found = null;
          
           collection.find().forEach(function(user){
               //  console.log(user.player_id)
               if(user.player_id == op.PlayerId[0]){
                  user_found = user
                         
              } 
          }, function(err) {
              
             // console.log('' + result + ' document(s) updated');
              var reply =  {
                'WithdrawAndDepositResponse': {
                    'Balance': user_found.balance,
                    'ErrorCode': 1000,
                    'CasinoTransferId': transfer_id,
                    'ErrorMessage': 'OK',
                    'TotalBet': bet,
                    'TotalDeposit': deposit,
                    'PlayTime': 2,
                }
            };
              cb(reply,res) 
          })
        }
    });
  },

}
module.exports = obj
 // generate unique defence
function gen_rand_code () {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    var hash = SHA256(text).toString()
  
    return hash;
  }