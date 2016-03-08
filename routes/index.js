var express = require('express');
var router = express.Router();
var knex = require('../db');

/* GET home page. */
router.get('/', function(req, res) {
    var act=req.query;
    showbbs(null,function(err, models) {
        if (err) {
            return res.send(err);
        }
        res.render('index',{models:models});
    });
});
//ajax loadlist
router.get('/list', function(req, res) {
    var act=req.query;
    showbbs(null,function(err, models) {
        if (err) {
            return res.send(err);
        }
        res.json(models);
    });
});
//search bbs
router.get('/search', function(req, res) {
    var act=req.query;
    knex('article')
        .where('title', 'like', '%'+act.keyword+'%')
        .orderBy('id', 'desc')
        .limit(3)
        .then(function (models) {
            res.json(models);
        })
        .catch(function (err) {

        });
});
//del bbs
router.get('/del', function(req, res) {
    var act=req.query;
    knex('article')
        .where('id', act.id)
        .del()
        .then(function(data){
            showbbs(null,function(err, models) {
                if (err) {
                    return res.send(err);
                }
                res.json(models);
            });
        })
        .catch(function(){
            res.json({msg:'no'});
        });
});
//showbbs
function showbbs(data, callback){
    knex('article')
        .orderBy('id', 'desc')
        .limit(3)
        .then(function (models) {
            callback(null, models);
        })
        .catch(function (err) {
            callback(err);
        });

}
//add bbs
router.post('/', function(req, res) {
  var abc = req.body;
  //console.log(abc);
    knex('article')
        .insert({title:abc.title,content:abc.content})
        .then(function(data){
            showbbs(null,function(err, models) {
                if (err) {
                    return res.send(err);
                }
                res.json(models);
            });
        })
        .catch(function(err) {
            res.json({msg:'no'});
        });

});

router.get('/pk', function(req, res) {
   res.send('ho pk');
});

router.get('/123/321', function(req, res) {
    res.send('ho pk');
});
module.exports = router;
