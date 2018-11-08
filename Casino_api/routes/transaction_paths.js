const helpers = require('../config/helpers');
const { get_user, save_empty_req, save_player_req, send_reply, test_codes, save_codes, user_deposit, user_bet, withdraw_deposit } = helpers;
const keys = require('./paths');
const { mainPath, SystemBalancePath } = keys;
var parseString = require('xml2js').parseString;
var qs = require('querystring');
const mongoose = require('mongoose');
const moment = require('moment')

require('../models/transactions');
require('../models/user');
require('../models/operators')

const async = require('async');
const User = mongoose.model('user');
const Operator = mongoose.model('operators')
const Transaction = mongoose.model('transaction');
const ObjectID = require('mongodb').ObjectID

function authenticate(req, res, next) {
    passport.authenticate('token', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            res.status(401).json({ message: "Incorrect token credentials" });
        }

        req.user = user;
        next();
    });
}

module.exports = (app, UserCollection, DefCodeCollection) => {
    app.post(mainPath + '/settings/:id', async (req, res) => {
        var key = Object.keys(req.body)[0];
        var robj = req.body[key];
      //  debugger;
        console.log("PLAYER ID: " + robj.player_id)
        console.log(robj)
        /* !!!!!!!!req.params.id
           0: NORMAL SETTINGS
           1: ROUND_CONTINUE SETTINGS
           2: ROUND_CANCEL SETTINGS
        */
        console.log(req.params.id)
        // var obj = {
            
        // }
        if (req.params.id === '0') {
            var query = await User.update({ player_id: robj.player_id }, { $set: { ["settings." + key]: { "code": robj.code, "msg": robj.msg } } }, { upsert: true })
            if (query.n === 0) {
                return res.json({ 'msg': 'Wrong player_id' })
            }
            return res.json({ 'msg': 'updated' })
        }
        if (req.params.id === '1') {
            var query = await User.update({ player_id: robj.player_id }, { $set: { ["settings_continue." + key]: { "code": robj.code, "msg": robj.msg } } }, { upsert: true })
            if (query.n === 0) {
                return res.json({ 'msg': 'Wrong player_id' })
            }
            res.json({ 'msg': 'updated' })
        }
        if (req.params.id === '2') {
            var query = await User.update({ player_id: robj.player_id }, { $set: { ["settings_cancel." + key]: { "code": robj.code, "msg": robj.msg } } }, { upsert: true })
            if (query.n === 0) {
                return res.json({ 'msg': 'Wrong player_id' })
            }
            res.json({ 'msg': 'updated' })
        }

 })

    app.get(SystemBalancePath, (req, res) => {

        var total_balance = 0;
        const transactions = Transaction.find({  op: { $nin: ["AuthRequest", "GetPlayerBalance"] } })
            .then((transactions) => {
                for (i = 0; i < transactions.length; i++) {
                  //  console.log(transactions[i])
                    // if(transactions[i].amount === undefined || transactions[i].amount === null ||transactions[i].amount ===NaN)return
                    if (Number.isInteger(transactions[i].amount) && transactions[i].op === 'WithdrawRequest') {
                        total_balance += transactions[i].amount
                    } else if(Number.isInteger(transactions[i].amount) && transactions[i].op === 'DepositRequest') {
                        total_balance -= transactions[i].amount
                    }
                   
                }
            //    console.log(total_balance)

            }).then(() => {
                console.log(total_balance)
                res.send({ "total_balance": total_balance })
            })



    })
    app.post(mainPath, (req, res) => {
         console.log(req.body)
         const { player_id, portal_code } = req.body

         test_codes('Defence_code', (dc) => {
             var obj = {
                 player_id,
                 portal_code,
                 code: dc
             }
             save_codes('Defence_code', obj)
             //req.session.dc = dc
             res.send({ "defence_code": dc })
         })
    })


    //post requests
    app.post(mainPath + '/:operator_name' , (req, res) => {

        var body = '';

        req.on('data', function (data) {
            body += data;
            // Too much POST data, kill the connection! // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', () => {

            var post = qs.parse(body);

            try {

                var json = parseString(body, (err, result) => {
                    if (err) {
                        console.log("go err:", err);
                        return;
                    }
                    //  console.log(result); // <<-
                    var key = Object.keys(result)[0];

                    var un = result[key].UserName[0], pa = result[key].Password[0];
                    // query db for this provider's credentials

                    // 1. provider has endpoint, lookup which provider this is (hard coded provider)
                    // 2. query db, ger provider
                    // 3. verify username/password
                   Operator.find({operator_name: req.params.operator_name}).then((err,op) => {
                         if(err) return console.log("err", err)
                            if(op.name !== un || op.pass !== pa) {
                                return res.end()
                            }   

                   }).catch(err => console.log(err))


                    /////////////////////////////

                    //authenticate request        
                    if (true /*undefined !== result['AuthRequest']*/) {
                        //console.log(key)
                      //  var ar = result['AuthRequest'];
                        var robj = result[key];
                        console.log(robj)

                        var user_found_id = null;
                        var reply;                        

                        var ret = {
                            code: 1000,
                            msg: 'OK',
                            balance: null,
                            transfer_id: null
                        };
                        debugger;
                        async.waterfall([
                            function (callback) {
                                get_user(UserCollection,robj.PlayerId[0], (_user_found_id) => {

                                   if(_user_found_id){
                                      user_found_id = _user_found_id;
                                      ret.balance = _user_found_id.balance
                                   }
                                      return callback(null); 
                                    
                                });
                            },
                            function (callback) {
                                // FIXME - ako ednoto e null ?
                                if (/*null == user_found_id && */null == user_found_id) {
                                    // greshka
                                    ret.code = 3000;
                                    ret.msg = 'User not found';
                                    ret.balance = 0;
                                    return callback('user not found')
                                } 
                                    return callback(null);
                            },
                            function (callback){
                                 if(user_found_id.banned === 'banned') {
                                     ret.code = 3102;
                                     ret.msg = 'User is banned';
                                     ret.balance = 0;
                                     return callback('player is banned')
                                 }
                                    return callback(null)
                            },
                            function (callback) {
                                 if ('AuthRequest' !== key) {
                                    return callback(null); // go on. this is no auth so do not verify DC
                                } else {
                                   DefCodeCollection.findOne({def_code:robj.DefenceCode[0]},function(err, res){
             
                                    if (err || res === null) {
                                    console.log(err)
                                        ret.code = 3000;
                                        ret.msg = 'INVALID DEFENCE CODE';
                                        ret.balance = null;
                                        return callback('INVALID DEFENCE CODE')

                                    }
                                    if(res.player_id !== robj.PlayerId[0] || res.portal_code !== robj.PortalCode[0]) {
                                       ret.code = 3000;
                                       ret.msg = 'INVALID DEFENCE CODE';
                                       ret.balance = null;
                                          return callback('INVALID DEFENCE CODE')
                                    }

                                      if(res.session_id !== undefined){
                                       ret.code = 3100;
                                       ret.msg = 'DUPLICATE';
                                       ret.balance = null;
                                          return callback('DUPLICATE')
                                      }
                                        return callback(null)
                                   })
                                }
                            },
                            function (callback) {
                                if ('AuthRequest' !== key) {
                                    return callback(null); // go on. this is no auth so do not verify DC
                                } else {
                                    var req_dc = robj.DefenceCode[0]
                                    console.log('!!!!!!!!!!!!')
                                    DefCodeCollection.findOne({ def_code: req_dc }, function (err, res) {
                                        console.log('------------_DEFENCE CODE-------------')
                                      //  console.log(res)
                                     //   res.session_id = robj.SessionId[0] 
                                        if (res === null) {
                                            ret.code = 3100;
                                            ret.msg = 'Wrong defence code'
                                            ret.balance = null;
                                            return callback('wwrong dc')
                                        }
                                        DefCodeCollection.update({def_code:res.def_code},{$set:{session_id:robj.SessionId[0]}})
                                        return callback(null)

                                    })
                                }
                         
                            },
                            function (callback) {
                                if (key === 'WithdrawRequest') {
                               //     debugger
                                    if (user_found_id.balance < robj.Amount[0]) {
                                        ret.code = 3100;
                                        ret.msg = 'INSUFFICIENT_FUNDS';
                                        ret.balance = user_found_id.balance;
                                        return callback('INSUFFICIENT_FUNDS')
                                    }else {
                                        console.log('------------ IN WithDraw Requests')
                                        test_codes('Transfer_code',   (transfer_id) => {
                                           // console.log('transfer ID ====== %s ', transfer_id)
                                                    save_codes('Transfer_code', {code:transfer_id})
                                                    ret.transfer_id = transfer_id  
                                                   // console.log('balance for player ==== %s ', user_found_id.balance)
                                                   // console.log('player bet ===== %s', robj.Amount[0])       
                                             // debugger

                                                user_bet(UserCollection,user_found_id.player_id,robj.Amount[0],user_found_id.balance,(new_b)=> {
                                                  //  console.log('new balance !!!!!!!!!!!!!!!!!!!!!! %s',new_b)
                                                    ret.balance = new_b
                                                    return callback(null)
                                                })
                                          })
                                    }
                                }else {
                                    return callback(null)
                                }

                            },
                            function (callback) {
                               if(key === 'DepositRequest') {
                                   test_codes('Transfer_code', (transfer_id) => {
                                       ret.transfer_id = transfer_id
                                       user_deposit(UserCollection,user_found_id.player_id,robj.Amount[0],user_found_id.balance, (new_b) => {
                                            ret.balance = new_b
                                        callback(null)
                                       })
                                   })

                               }else {
                                   return callback(null)
                               }
                            },
                            function (callback) {
                                // all OK, check db
                                        debugger
                                
                                   var settings = User.find({player_id: user_found_id.player_id }, (err, res_settings) => {
                                    if (err) {
                                         console.log(err)
                                    }
                                   // console.dir(res_settings)
                                    if (res_settings.length === 0) {
                                        // no settings for this user, proceed as normal
                                        return callback('no settings');
                                    }

                                    /// inject bla bla
                                    var use_obj = res_settings[0]._doc;
                                    //console.log(use_obj)
                                    //NORMAL SETTINGS
                                    if (undefined !== use_obj.settings && undefined !== use_obj.settings['auth'] && key === 'AuthRequest') {
                                        //ret = use_obj.settings['auth'];
                                        ret.code = use_obj.settings['auth'].code
                                        ret.msg = use_obj.settings['auth'].msg
                                      //  console.log('ret code === %s', ret.code)
                                       // console.log("!!! override auth response to: " + JSON.stringify(ret));                                        
                                    }
                                    if(undefined !== use_obj.settings && undefined !== use_obj.settings['withdr'] && key === 'WithdrawRequest' && robj.Reason[0] === 'ROUND_BEGIN'){
                                        ret.code = use_obj.settings['withdr'].code
                                        ret.msg = use_obj.settings['withdr'].msg
                                    }
                                     if(undefined !== use_obj.settings && undefined !== use_obj.settings['deposit'] && key === 'DepositRequest'){
                                        ret.code = use_obj.settings['deposit'].code
                                        ret.msg = use_obj.settings['deposit'].msg
                                    }
                                    //ROUND CONTINUE
                                      if(undefined !== use_obj.settings_continue && undefined !== use_obj.settings_continue['withdr'] && key === 'WithdrawRequest'&& robj.Reason[0] === 'ROUND_CONTINUE'){
                                        ret.code = use_obj.settings_continue['withdr'].code
                                        ret.msg = use_obj.settings_continue['withdr'].msg
                                    }
                                     if(undefined !== use_obj.settings_continue && undefined !== use_obj.settings_continue['deposit'] && key === 'DepositRequest' && robj.Reason[0] === 'ROUND_CONTINUE'){
                                        ret.code = use_obj.settings_continue['deposit'].code
                                        ret.msg = use_obj.settings_continue['deposit'].msg
                                    }
                                    //ROUND CANCEL
                                     if(undefined !== use_obj.settings_continue && undefined !== use_obj.settings_continue['deposit'] && key === 'DepositRequest' && robj.Reason[0] === 'ROUND_CANCEL'){
                                        ret.code = use_obj.settings_cancel['deposit'].code
                                        ret.msg = use_obj.settings_cancel['deposit'].msg
                                    }

                                    return callback(null);
                                });
                            },
                        ], function (err) {
                            console.log("WF end: %s", err);
                    
                          
                            //var use_balance = 0;
                           // if ('WithdrawRequest' === key) debugger;
                            if (null !== user_found_id){
                                console.log('ret.transfer_id =============== %s', ret.transfer_id)
                                var reason = '';
                                var amount = '';
                                if( 'AuthRequest' !== key) {
                                    reason = robj.Reason[0]
                                    amount = robj.Amount[0]
                                }
                              //  console.log(robj)
                                const request = new Transaction({ op: key, err_code: ret.code, msg: ret.msg,amount, user: user_found_id._id,transfer_id: ret.transfer_id,session_id:robj.SessionId[0],reason: reason,created: moment(new Date(Date.now())).format('MM/DD/YYYY'), hour:moment(Date.now()).utcOffset('+0300').format('HH:mm:ss')})
                                //use_balance = user_found_id.balance
                                console.log("request: = ", request)
                                save_player_req( user_found_id._id, request);
                            } else{
                                save_empty_req(key, ret.code, ret.msg)
                            }
             
                            var responses = {
                                'AuthRequest': 'AuthResponse',
                                'WithdrawRequest': 'WithdrawResponse',
                                'DepositRequest': 'DepositResponse',
                                'RefundRequest': 'RefundResponse',
                                'WithdrawAndDepositRequest': 'WithdrawAndDepositResponse',
                                'GetPlayerBalanceRequest': 'GetPlayerBalanceResponse'}
                           // console.log('RESPONE + key ===== %s',responses[key])
                           // console.log('request ket ?  ---- ==== %s', key)
                            var use_response_str = responses[key];
                           // console.log('use_response_str ====== %s',use_response_str )
                            if (undefined === use_response_str) {
                                console.log("!!!!! losho cannot resolve response string for key[%s] -- this is fatal!!", key);
                                throw "ouch! cannot lookup[ response str"
                            }

                            reply = {};
                            reply[use_response_str] = {};
                            var r = reply[use_response_str];
                            console.log('this is r obj ==========')
                            //console.log(r)
                            console.log('------------------------')
                            switch (key) {

                                case 'AuthRequest':
                                    r['Balance'] = ret.balance;
                                    r['ErrorCode'] = ret.code;
                                    r['ErrorMessage'] = ret.msg;
                                    break;
                                // auth - do nothing.
                                case 'WithdrawRequest': 
                                case 'DepositRequest':
                                case 'RefundRequest':
                                case 'WithdrawAndDepositRequest':
                                case 'GetPlayerBalanceRequest':
                                    r['Balance'] = ret.balance;
                                    r['ErrorCode'] = ret.code;
                                    r['ErrorMessage'] = ret.msg;
                                    r['CasinoTransferId'] = ret.transfer_id;
                                    r['TotalBet'] =robj.Amount[0];
                                    break;

                                default:
                                console.log("unhandled key: %s -- this is fatal!", key)
                                throw 'oopss something went wrong' 

                            }
                           // console.log('------------- reply --------------')
                            console.log(reply)
                         //   console.dir(r)
                            send_reply(reply, res);
                        });


                    } //else if (undefined !== result['WithdrawRequest']) { //withdraw request start

                        // console.log(result[0])
                        // var wr = result['WithdrawRequest'];
                        // var reason = wr.Reason[0]
                        // var reply;
                        // var user_found_id = null;
                        
                        // var ret = {
                        //     code: 1000,
                        //     msg: 'OK',
                        //     balance: null,
                        //     transfer_id: 0
                        // };

                        // async.waterfall([
                        //     function(callback){
                        //     get_user(UserCollection, wr.PlayerId[0], (_user_found_id) => {
                        //            // user_found_id = _user_found_id;
                        //            if(_user_found_id){
                        //               user_found_id = _user_found_id;
                        //               ret.balance = _user_found_id.balance
                        //            }        
                        //         });
                        //        return callback(null)
                        //     },
                        //     function (callback) {
                        //        if (/*null == user_found_id && */null == user_found_id) {
                        //             // greshka
                        //             ret.code = 3000;
                        //             ret.msg = 'User not found';
                        //             ret.balance = 0;
                        //             return callback('user not found')
                        //         } 
                                
                        //        return callback(null)                               
                        //     },
                        //     function (callback) {
                        //       if(user_found_id.balance < wr.Amount[0]) {
                        //             ret.code = 3100;
                        //             ret.msg = 'Insufficiant balance';
                        //             ret.balance = user_found_id.balance;
                        //             return callback('insufficiant balance')
                        //       }
                        //         return callback(null)
                        //     },
                        //     function (callback) {
                        //         if(reason != 'ROUND_BEGIN') {
                        //             ret.code = 3200;
                        //             ret.msg = 'Invalid Reason';
                        //             ret.balance = user_found_id.balance
                        //             return callback('invalid reason')
                        //         }
                        //         return callback(null)
                        //     },
                        //     function (callback) {
                        //            // all OK, check db
                        //            var settings = User.find({player_id: user_found_id.player_id }, (err, res_settings) => {
                        //             if (err) {
                        //                  console.log(err)
                        //             }
                        //            // console.dir(res_settings)
                        //             if (res_settings.length === 0) {
                        //                 // no settings for this user, proceed as normal
                        //                 return callback('no settings');
                        //             }

                        //             /// inject bla bla
                        //             var use_obj = res_settings[0]._doc;

                        //             if (undefined !== use_obj.settings && undefined !== use_obj.settings['withdr']) {
                        //                 //ret = use_obj.settings['auth'];
                        //                 ret.code = use_obj.settings['withdr'].code
                        //                 ret.msg = use_obj.settings['withdr'].msg
                        //                 console.log('ret code === %s', ret.code)
                            
                        //                // console.log("!!! override auth response to: " + JSON.stringify(ret));                                        
                        //             }

                        //             return callback(null);
                        //         });
                        //     }
                        // ],function(err){
                        //     console.log("WF end: %s", err);
                        //      var transfer_code;
                        //      test_codes('Transfer_code', (_transfer_id) => {
                        //          save_codes('Transfer_code', _transfer_id)
                        //          transfer_code = _transfer_id
                        //     if (null !== user_found_id){
                        //         const request = new Transaction({ op: "Withdraw", transfer_id: _transfer_id, err_code: ret.code, msg: ret.msg, user: user_found_id._id })
                        //         //use_balance = user_found_id.balance
                        //         save_player_req(User, user_found_id._id, request);
                        //     } else{
                        //         save_empty_req('Withdraw', ret.code, ret.msg)
                        //     }
                        //      })
                        //     reply = {
                        //             'WithdrawResponse': {
                        //                 'Balance': ret.balance,
                        //                 'ErrorCode': ret.code,
                        //                 'CasinoTransferId': transfer_code,
                        //                 'ErrorMessage': ret.msg,
                        //                 'TotalBet': wr.Amount[0],
                        //                 'TotalWin': null,
                        //                 'PlayTime': null,
                        //             }
                        //         };
                        //     send_reply(reply, res);
                            
                        // })

                        // // done or error
                        // get_user(UserCollection, wr, (user_found_id, user_found_name) => {
                        //     var amount = JSON.parse(wr.Amount[0]);
                        //     var reason = wr.Reason[0]
                        //     console.log('reason === %s', reason)

                        //     if (null == user_found_id && null == user_found_name) {
                        //         // greshka
                        //         reply = {
                        //             'WithdrawResponse': {
                        //                 'Balance': null,
                        //                 'ErrorCode': 3000,
                        //                 'CasinoTransferId': null,
                        //                 'ErrorMessage': 'User not found',
                        //                 'TotalBet': null,
                        //                 'TotalWin': null,
                        //                 'PlayTime': null,
                        //             }
                        //         };
                        //         test_codes('Transfer_code', (transfer_id) => {
                        //             save_codes('Transfer_code', transfer_id)
                        //             save_empty_req('Withdraw', 3000, 'User not found', amount, transfer_id)
                        //         })
                        //         send_reply(reply, res)
                        //     } else if (user_found_name == null) {
                        //         reply = {
                        //             'WithdrawResponse': {
                        //                 'Balance': null,
                        //                 'ErrorCode': 3101,
                        //                 'CasinoTransferId': null,
                        //                 'ErrorMessage': 'Wrong player name or password',
                        //                 'TotalBet': null,
                        //                 'TotalWin': null,
                        //                 'PlayTime': null,
                        //             }
                        //         };
                        //         test_codes('Transfer_code', (transfer_id) => {
                        //             save_codes('Transfer_code', transfer_id)
                        //             save_empty_req('Withdraw', 3101, 'Wrong player name or password', amount, transfer_id)
                        //         })
                        //         send_reply(reply, res)

                        //     } else if (user_found_id == null || user_found_id.player_id != user_found_name.player_id) {
                        //         reply = {
                        //             'WithdrawResponse': {
                        //                 'Balance': null,
                        //                 'ErrorCode': 3104,
                        //                 'CasinoTransferId': null,
                        //                 'ErrorMessage': 'Wrong player ID',
                        //                 'TotalBet': null,
                        //                 'TotalWin': null,
                        //                 'PlayTime': null,
                        //             }
                        //         };
                        //         test_codes('Transfer_code', (transfer_id) => {
                        //             save_codes('Transfer_code', transfer_id)
                        //             save_empty_req('Withdraw', 3104, 'Wrong player ID', amount)
                        //         })
                        //         send_reply(reply, res)

                        //     } else if (user_found_name.balance < wr.Amount[0]) {
                        //         reply = {
                        //             'WithdrawResponse': {
                        //                 'Balance': null,
                        //                 'ErrorCode': 3103,
                        //                 'CasinoTransferId': null,
                        //                 'ErrorMessage': 'Insufficient balance',
                        //                 'TotalBet': null,
                        //                 'TotalWin': null,
                        //                 'PlayTime': null,
                        //             }
                        //         };
                        //         test_codes('Transfer_code', (transfer_id) => {
                        //             save_codes('Transfer_code', transfer_id)
                        //             save_empty_req('Withdraw', 3103, 'Insufficient balance', amount, transfer_id, user_found_name)
                        //         })
                        //         send_reply(reply, res)


                        //     }
                        //     //     else if(undefined === session_id){
                        //     //       reply =  {
                        //     //         'WithdrawResponse': {
                        //     //             'Balance': null,
                        //     //             'ErrorCode': 3102,
                        //     //             'CasinoTransferId': null,
                        //     //             'ErrorMessage': 'Session has expired',
                        //     //             'TotalBet': null,
                        //     //             'TotalWin': null,
                        //     //             'PlayTime': null,
                        //     //         }
                        //     //     };
                        //     //    test_codes('Transfer_code',(transfer_id) => {
                        //     //       save_codes('Transfer_code',transfer_id)
                        //     //       save_empty_req('Withdraw',3101,'Session has expired',amount,transfer_id); 
                        //     //      })                 
                        //     //       send_reply(reply,res)
                        //     //   }
                        //     else if (reason != 'ROUND_BEGIN') {
                        //         reply = {
                        //             'WithdrawResponse': {
                        //                 'Balance': null,
                        //                 'ErrorCode': 3105,
                        //                 'CasinoTransferId': null,
                        //                 'ErrorMessage': 'Invalid reason',
                        //                 'TotalBet': null,
                        //                 'TotalWin': null,
                        //                 'PlayTime': null,
                        //             }
                        //         };
                        //         test_codes('Transfer_code', (transfer_id) => {
                        //             save_codes('Transfer_code', transfer_id)
                        //             save_empty_req('Withdraw', 3105, 'Invalid reason', amount, transfer_id, user_found_name);
                        //         })
                        //         send_reply(reply, res)


                        //     } else {
                        //         var { player_id, balance, requests, _id } = user_found_name;



                        //         test_codes('Transfer_code', (transfer_id) => {
                        //             save_codes('Transfer_code', transfer_id)

                        //             const request = new Transaction({ op: "Withdraw", err_code: '1000', transfer_id: transfer_id, amount: amount, msg: 'OK', user: _id })
                        //             save_player_req(User, _id, request);
                        //          //   user_bet(UserCollection, player_id, transfer_id, amount, balance, res, wr, send_reply)
                        //         })
                        //     }
                        // })
                   // }   

                        //deposit request start
                    else if (undefined !== result['DepositRequest']) {
                        var dr = result['DepositRequest'];
                        //var session_dc = req.session.dc
                        var reply;

                        get_user(UserCollection, dr, (user_found_id, user_found_name) => {
                            var amount = JSON.parse(dr.Amount[0]);
                            var reason = dr.Reason[0]
                            // done or error
                            if (null == user_found_id && null == user_found_name) {
                                // greshka
                                reply = {
                                    'DepositResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3000,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'User not found',
                                        'TotalDeposit': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {
                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('Deposit', 3000, 'User not found', amount, transfer_id);
                                })
                                send_reply(reply, res)
                            } else if (user_found_name == null) {
                                reply = {
                                    'DepositResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3100,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'Wrong username or password',
                                        'TotalDeposit': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {
                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('Deposit', 3100, 'Wrong username or password', amount, transfer_id);
                                })
                                send_reply(reply, res)


                            } else if (user_found_id == null || user_found_id.player_id != user_found_name.player_id) {
                                reply = {
                                    'DepositResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3102,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'Wrong player ID',
                                        'TotalDeposit': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {
                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('Deposit', 3102, 'Wrong player ID', amount);
                                })
                                send_reply(reply, res)


                            }
                            //     else if(undefined === session_id){
                            //     reply =  {
                            //       'DepositResponse': {
                            //           'Balance': null,
                            //           'ErrorCode': 3101,
                            //           'CasinoTransferId': null,
                            //           'ErrorMessage': 'Session has expired',
                            //           'TotalDeposit': null,
                            //           'TotalWin': null,
                            //           'PlayTime': null,
                            //       }
                            //   };
                            //  test_codes('Transfer_code',(transfer_id) => {
                            //            save_codes('Transfer_code',transfer_id)  
                            //           save_empty_req('Deposit',3101,'Session has expired',amount,transfer_id);      
                            //  })                                                                    
                            //   send_reply(reply,res)
                            // }
                            else if (reason != 'ROUND_END') {
                                reply = {
                                    'DepositResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3105,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'Invalid reason',
                                        'TotalDeposit': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('Deposit', 3105, 'Invalid reason', amount, t_id, user_found_name);
                                })
                                send_reply(reply, res)
                            } else {
                                var { player_id, balance, _id } = user_found_name


                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)

                                    const request = new Transaction({ op: "Deposit", err_code: '1000', transfer_id: transfer_id, amount: amount, msg: 'OK', user: _id })

                                    save_player_req(User, _id, request);
                                    user_deposit(UserCollection, player_id, transfer_id, amount, balance, res, dr, 'dr', send_reply)
                                })
                            }
                        })

                    } else if (undefined !== result['RefundRequest']) {

                        console.log('in the refund request !!!!!+++')
                        var rr = result['RefundRequest'];
                        var code = 1000;
                        get_user(UserCollection, rr, (user_found_id, user_found_name) => {
                            var amount = JSON.parse(rr.Amount[0]);
                            var reason = rr.Reason[0]
                            console.log('reason === %s', reason)

                            if (null == user_found_id && null == user_found_name) {
                                // greshka
                                reply = {
                                    'RefundResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3000,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'User not found',
                                        'TotalBet': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('Refund', 3000, 'User not found', amount, transfer_id)
                                })
                                send_reply(reply, res)
                            } else if (user_found_name == null) {
                                reply = {
                                    'RefundResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3101,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'Wrong player name or password',
                                        'TotalBet': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('Refund', 3101, 'Wrong player name or password', amount, transfer_id)
                                })
                                send_reply(reply, res)

                            } else if (user_found_id == null || user_found_id.player_id != user_found_name.player_id) {
                                reply = {
                                    'RefundResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3104,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'Wrong player ID',
                                        'TotalBet': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('Refund', 3104, 'Wrong player ID', amount, transfer_id)
                                })
                                send_reply(reply, res)

                            } else if (user_found_name.balance < rr.Amount[0]) {
                                reply = {
                                    'RefundResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3103,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'Insufficient balance',
                                        'TotalBet': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('Refund', 3103, 'Insufficient balance', amount, transfer_id, user_found_name)

                                })
                                send_reply(reply, res)

                            }
                            //     else if(undefined === session_id){
                            //       reply =  {
                            //         'RefundResponse': {
                            //             'Balance': null,
                            //             'ErrorCode': 3102,
                            //             'CasinoTransferId': null,
                            //             'ErrorMessage': 'Session has expired',
                            //             'TotalBet': null,
                            //             'TotalWin': null,
                            //             'PlayTime': null,
                            //         }
                            //     };
                            //   test_codes('Transfer_code',(transfer_id) => {

                            //     save_codes('Transfer_code',transfer_id) 
                            //     save_empty_req('Refund',3101,'Session has expired',amount,transfer_id); 
                            //   });                 
                            //     send_reply(reply,res)
                            //   }
                            else if (reason != 'ROUND_END') {
                                reply = {
                                    'RefundResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3105,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'Invalid reason',
                                        'TotalBet': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('Refund', 3105, 'Invalid reason', amount, transfer_id, user_found_name);

                                })
                                send_reply(reply, res)
                            } else {
                                var { player_id, balance, requests, _id } = user_found_name;


                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    const request = new Transaction({ op: "Refund", err_code: '1000', transfer_id: transfer_id, amount: amount, msg: 'OK', user: _id })
                                    save_player_req(User, _id, request);
                                    user_deposit(UserCollection, player_id, transfer_id, amount, balance, res, rr, 'rr', send_reply)
                                })
                            }
                        })

                    } else if (undefined !== result['WithdrawAndDepositRequest']) {
                        var wdr = result['WithdrawAndDepositRequest'];
                        var code = 1000;
                        get_user(UserCollection, wdr, (user_found_id, user_found_name) => {
                            var amount = JSON.parse(wdr.Amount[0]);
                            var bet = JSON.parse(wdr.WinAmount[0])
                            var reason = wdr.Reason[0]
                            console.log('reason === %s', reason)

                            if (null == user_found_id && null == user_found_name) {
                                // greshka
                                reply = {
                                    'WithdrawAndDepositResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3000,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'User not found',
                                        'TotalBet': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('WithdrawAndDeposit', 3000, 'User not found', amount, transfer_id)
                                })
                                send_reply(reply, res)
                            } else if (user_found_name == null) {
                                reply = {
                                    'WithdrawAndDepositResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3101,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'Wrong player name or password',
                                        'TotalBet': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('WithdrawAndDeposit', 3101, 'Wrong player name or password', amount, transfer_id)
                                });
                                send_reply(reply, res)

                            } else if (user_found_id == null || user_found_id.player_id != user_found_name.player_id) {
                                reply = {
                                    'WithdrawAndDepositResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3104,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'Wrong player ID',
                                        'TotalBet': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('WithdrawAndDeposit', 3104, 'Wrong player ID', amount, transfer_id)
                                })

                                send_reply(reply, res)

                            } else if (user_found_name.balance < wdr.Amount[0]) {
                                reply = {
                                    'WithdrawAndDepositResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3103,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'Insufficient balance',
                                        'TotalBet': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('WithdrawAndDeposit', 3103, 'Insufficient balance', amount, transfer_id, user_found_name)

                                })
                                send_reply(reply, res)

                            }
                            //     else if(undefined === session_id){
                            //       reply =  {
                            //         'WithdrawAndDepositResponse': {
                            //             'Balance': null,
                            //             'ErrorCode': 3102,
                            //             'CasinoTransferId': null,
                            //             'ErrorMessage': 'Session has expired',
                            //             'TotalBet': null,
                            //             'TotalWin': null,
                            //             'PlayTime': null,
                            //         }
                            //     };
                            //     test_codes('Transfer_code',(transfer_id) => {

                            //         save_codes('Transfer_code',transfer_id) 
                            //         save_empty_req('WithdrawAndDeposit',3101,'Session has expired',amount,transfer_id); 
                            //     })                 
                            //     send_reply(reply,res)
                            //   }
                            else if (reason != 'ROUND_END') {
                                reply = {
                                    'WithdrawAndDepositResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3105,
                                        'CasinoTransferId': null,
                                        'ErrorMessage': 'Invalid reason',
                                        'TotalBet': null,
                                        'TotalWin': null,
                                        'PlayTime': null,
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('WithdrawAndDeposit', 3105, 'Invalid reason', amount, transfer_id, user_found_name);

                                })
                                send_reply(reply, res)
                            } else {
                                var { player_id, balance, requests, _id } = user_found_name;


                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)

                                    const request = new Transaction({ op: "WithdrawAndDeposit", err_code: '1000', transfer_id: transfer_id, amount: amount, msg: 'OK', user: _id })
                                    save_player_req(User, _id, request);
                                    withdraw_deposit(UserCollection, player_id, transfer_id, amount, bet, balance, res, wdr, send_reply);
                                })
                            }
                        })

                    } else if (undefined !== result['GetPlayerBalanceRequest']) {
                        var reply;
                        var gpb = result['GetPlayerBalanceRequest'];


                        get_user(UserCollection, gpb, (user_found_id, user_found_name) => {

                            // console.log(user_found_id)
                            // console.log(user_found_name)            

                            if (null == user_found_id && null == user_found_name) {
                                // greshka
                                reply = {
                                    'GetPlayerBalanceResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3000,
                                        'ErrorMessage': 'User not found'
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('GetPlayerBalance', 3000, 'User not found', transfer_id)
                                });
                                // console.log(user_found)
                            } else if (user_found_name == null) {

                                reply = {
                                    'GetPlayerBalanceResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3102,
                                        'ErrorMessage': 'Wrong username or password'
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('GetPlayerBalance', 3102, 'Wrong username or password', transfer_id)
                                })

                            } else if (user_found_id == null || user_found_id.player_id != user_found_name.player_id) {
                                reply = {
                                    'GetPlayerBalanceResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3104,
                                        'ErrorMessage': 'Wrong player ID'
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('GetPlayerBalance', 3104, 'Wrong player ID', transfer_id)
                                });

                            } else if (user_found_name.banned === true) {
                                reply = {
                                    'GetPlayerBalanceResponse': {
                                        'Balance': null,
                                        'ErrorCode': 3103,
                                        'ErrorMessage': 'Player is banned'
                                    }
                                };
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    save_empty_req('GetPlayerBalance', 3103, 'Player is banned', transfer_id)
                                });

                            }
                            // else if(undefined === session_id){
                            //     reply = {
                            //         'GetPlayerBalanceResponse': {
                            //         'Balance': null,
                            //         'ErrorCode': 3101,
                            //         'ErrorMessage': 'Session has expired'
                            //         }
                            //     };
                            // test_codes('Transfer_code',(transfer_id) => {

                            //      save_codes('Transfer_code',transfer_id) 
                            //      save_empty_req('GetPlayerBalance',3101,'Session has expired',transfer_id)
                            // })            
                            //  } 
                            else {

                                reply = {
                                    'GetPlayerBalanceResponse': {
                                        'Balance': user_found_name.balance,
                                        'ErrorCode': 1000,
                                        'ErrorMessage': 'OK'
                                    }
                                };
                                // console.log(user_found)          
                                test_codes('Transfer_code', (transfer_id) => {

                                    save_codes('Transfer_code', transfer_id)
                                    const request = new Transaction({ op: "GetPlayerBalance", err_code: '1000', transfer_id, msg: 'OK', user: user_found_name._id })
                                    save_player_req(User, user_found_name._id, request);
                                })
                                send_reply(reply, res)
                            }

                        });
                    } else {
                        console.log("unhandled key[%s], nothing to do..", key);
                        send_reply({ 'Error': { 'ErrorCode': 3000, 'ErrorMessage': 'unhandled command: [' + key + ']' } }, res);
                    }

                });
            } catch (ex) {
                console.log('error parsing xml - ' + ex)
            }
        });
    })

}