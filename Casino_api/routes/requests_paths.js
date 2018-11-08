const keys = require('./paths');
const {requestsPath} = keys;
const mongoose = require('mongoose');
require('../models/user');
const Transaction = mongoose.model('transaction');
const Player = mongoose.model('user')
const ObjectID = require('mongodb').ObjectId
const moment = require('moment')

module.exports = (app) => {
    app.get(requestsPath + '/:sorttype/:sortdirection/:page_num/:size',  (req, res) => {
        var page_num = parseInt(req.params.page_num),
            size = parseInt(req.params.size),
            query = {},
            response
        if(page_num < 0 ){
               response = {"error": true, "msg": "invalid page number shoud start at 1?!"}
               return res.json(response);
        }
        query.skip = size * page_num;
        query.limit = size;
        //dynamic sorting
        var sortObject = {};
        var stype = req.params.sorttype;
        var sdir = req.params.sortdirection;
        var totalPages;
        sortObject[stype] = sdir;
        // dynamic filtering
  
        var search_name = '';
        var filter_obj = {}
       // console.log(req.query)

        for (key in req.query) {
            //  console.log(key)
            req.query[key] !== '' && req.query[key] !== 'undefined' ? filter_obj[key] = req.query[key] : null

        }


      Transaction.count({},function(err, totalCount){
         if (err) {
             response = { "error": true, "message": "Error fetching data" }
         }
      
        Transaction.find(filter_obj).sort(sortObject).limit(query.limit).skip(query.skip).populate('user').exec((err, data) => { 

        
            if (err) {
                response = { "error": true, "message": "Error fetching data" };
            } else {
                console.log('data length ===== ',data.length)
                console.log('totalCount  ======  ',totalCount)
                var totalPages = Math.ceil(totalCount / size)
                response = { "error": false, "data": data, "pages": totalPages };
            }
     
            res.json(response);
        })
     })

  
    });


}