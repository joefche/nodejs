var express = require('express');
var router = express.Router();
var knex = require('../db');
var async = require('async');
var happy = require('../happy');


/* GET home page. */
router.get('/', function(req, res) {

    //happy.helloworld(null,function(err, data){
    //    console.log(data);
    //});
    res.render('page');
});
//datagrid post list
router.post('/list', function(req, res) {
    var act=req.body;
    var page=act.page;
    var rows=act.rows;

    var search={};
    if(act.title){
        search['title']=act.title;
    }
    if(act.content){
        search['content']=act.content;
    }

     showbbs(null,page,rows,search,function(err, result) {
         if (err) {
             return res.send(err);
         }

         res.json(result);

     });

});
router.post('/edit', function(req, res) {
    var act=req.body;
    knex('article')
        .where("id",act.id)
        .update({title:act.titles,content:act.contents})
        .then(function(data){
            res.json({msg:'yes'});
        })
        .catch(function(err){
            res.json({msg:'no'});
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
    var id=act.id.split(",");

    knex('article')
        //.where('id', act.id)
        .whereIn('id',[id])
        .del()
        .then(function(data){
            res.json({msg:'yes'});
        })
        .catch(function(err){
            console.log(err);
            res.json({msg:'no'});
        });

});
//ajax loadlist
router.get('/list', function(req, res) {
    var act=req.query;
    var page=act.page;
    var rows=act.rows;

    showbbs(null,page,rows,null,function(err, result) {
        if (err) {
            return res.send(err);
        }
        res.json(result);

    });
});
//showbbs

function showbbs(data,page,rows,search, callback){

    if(page==""){page=1;}
    if(rows==""){rows=10;}
    var offset = (page-1)*rows;

    var title = search.title;
    var content = search.content;

    async.parallel({
        total:function (callback) {
            var pk = knex('article')
                .count('* as total');
            if (title) {
                pk.where('title','like','%' + title + '%');
            }
            if (content) {
                pk.where('content','like', '%' + content + '%');
            }
                pk.then(function (data) {
                    callback(null, data[0].total);
                })
                .catch(function (err) {
                    callback(err);
                });
        },
        rows:function (callback) {
            var pk = knex('article')
                .orderBy('id', 'desc')
                .limit(rows)
                .offset(offset);

            if (title) {
                pk.where('title','like','%' + title + '%');
            }
            if (content) {
                pk.where('content','like', '%' + content + '%');
            }

            pk.then(function (models) {
                    callback(null,  models);
                })
                .catch(function (err) {
                    callback(err);
                });
        }
    }, function (err, result) {
        var total = 0;
        for (var footers in result.rows) {
            total += result.rows[footers].id;
        }
        result.footer = [{id:"合计："+total}];
        callback(null,result);

        //console.result;
    });

}
//add bbs
router.post('/', function(req, res) {
  var abc = req.body;
  //console.log(abc);
    knex('article')
        .insert({title:abc.titles,content:abc.contents})
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

module.exports = router;
