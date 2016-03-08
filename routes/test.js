/**
 * Created by JOEF.CHE on 2016/2/20.
 */
var knex = require('../db');
var async = require('async');

function showbbs(err,page,rows,search, callback) {
    async.parallel([
        function (callback) {
            knex('article')
                .count('* as total')
                .then(function (data) {
                    callback(null, {
                        total: data[0].total
                    });
                })
                .catch(function (err) {
                    callback(err);
                });
        },
        function (callback) {
            var pk=sql(page,rows,search);

                pk.then(function (models) {
                    callback(null, {rows:models});
                })
                .catch(function (err) {
                    callback(err);
                });
        }
    ], function (err, result) {
        callback(null,result);
        //console.result;
    });
}

function sql(page,rows,search){
    if(page==""){page=1;}
    if(rows==""){rows=10;}
    var offset = (page-1)*rows;
    var title = search.title;
    var content = search.content;
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
    return pk;
}
showbbs(null,1,10,{},function(err, result) {
    if (err) {
        return res.send(err);
    }
    console.log(result);
    //res.json(result);

});

module.exports={
    showbbs:showbbs
};
