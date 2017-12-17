var express = require('/usr/local/lib/node_modules/express');

var app = express();

//Resource//
//파일들이 있는 디렉터리(정적파일)를 사용하기 위해서 설정//
app.use(express.static('resources/images'));

var sample_8_router = require('./sample/sample_test');
app.use('/sample', sample_8_router);

var userservice_router = require('./userservice/userinfo');
app.use('/user', userservice_router);

var fcmpushservice_router = require('./fcmpush/pushservice');
app.use('/push', fcmpushservice_router);

var fileuploadservice_router = require('./fileupload/fileuploadtest');
app.use('/upload', fileuploadservice_router);

var redissession_router = require('./redisdb/redisdbtest');
app.use('/redis', redissession_router);

app.listen(3000, function(){
    console.log('connected');
});