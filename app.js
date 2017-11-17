var express = require('/usr/local/lib/node_modules/express');

var app = express();

var sample_8_router = require('./sample/sample_test');
app.use('/sample', sample_8_router);

var userservice_router = require('./userservice/userinfo');
app.use('/user', userservice_router);

var fcmpushservice_router = require('./fcmpush/pushservice');
app.use('/push', fcmpushservice_router);

app.listen(3000, function(){
    console.log('connected');
});