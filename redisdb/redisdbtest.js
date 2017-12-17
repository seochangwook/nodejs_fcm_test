var express = require('/usr/local/lib/node_modules/express');
var bodyParser = require('/usr/local/lib/node_modules/body-parser');
var redis   = require("/usr/local/lib/node_modules/redis");
var session = require('/usr/local/lib/node_modules/express-session');
var redisStore = require('/usr/local/lib/node_modules/connect-redis')(session);

//라우터별로 분리하기 위해 express의 라우터 기능 사용//
var router = express.Router();

//redis 세션관리//
var client  = redis.createClient(6379, 'localhost');

router.use(session({
    secret : 'seo',
    //Redis서버의 설정정보//
    store : new redisStore({
        client : client,
        ttl : 260
    }),
    saveUninitialized : false,
    resave : false
}));

//POST를 적용하기 위한 설정//
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

//메인 사이트 접속(Redis에 세션이 저장되어 있는지 확인)//
router.get('/sessioncheck', function(request, response){
    if(request.session.key){
        console.log('OK Session Valid...(' + request.session.key + ')');
        response.send('session valid (current login)');
    } else{
        console.log('NOT Session is not valid...(' + request.session.key + ')');
        response.send('session is not valid (login please)');
    }
});

router.post('/sessionlogin', function(request, response){
    if(request.session.key){
        console.log('OK Session Valid...(' + request.session.key + ')');
        response.send('session valid (auto login)');
    } else{
        request.session.key = request.body.id; //id값으로 세션에 키값을 저장//
        console.log('session save success...(' + request.session.key + ')');
        response.send('session save success');
    }
});

router.get('/sessionlogout', function(request, response){
    //세션을 삭제//
    request.session.destroy(function(err){
        if(err){
            console.log(err);
            response.send('session is not destroy');
        } else{
            console.log('session destroy success...');
            response.send('session is destroy (login please)');
        }
    });
});

module.exports = router; //모듈 적용//