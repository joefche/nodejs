/**
 * Created by JOEF.CHE on 2016/2/20.
 */
function helloworld(data,callback){
    console.log('hello');
    callback(null,{title:'hello world'});
}
function hello(data,callback){
    callback(null,{title:'hello'});
}
module.exports={
    helloworld: helloworld,
    hello: hello
}
