var express = require('/usr/local/lib/node_modules/express');
var redis   = require("/usr/local/lib/node_modules/redis");
var session = require('/usr/local/lib/node_modules/express-session');
var redisStore = require('/usr/local/lib/node_modules/connect-redis')(session);

var app = express();

//redis 세션관리//
var client  = redis.createClient(6379, 'localhost');

app.use(session({
    secret : 'seo',
    //Redis서버의 설정정보//
    store : new redisStore({
        client : client,
        ttl : 260
    }),
    saveUninitialized : false,
    resave : false
}));

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

var oracledbtest_router = require('./oracletest/oracledbtest');
app.use('/oracle', oracledbtest_router);

var mailtest_router = require('./mailtest/smtpmailtest');
app.use('/mail', mailtest_router);

app.listen(3000, function(){
    console.log('connected');
});