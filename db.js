var knex = require('knex')({
    client: 'mysql',
    //debug: true,  //显示查询的 sql 语句
    connection: {
        host     : '127.0.0.1',
        user     : 'root',
        password : '123456',
        database : 'node'
    }
});
module.exports=knex;