var express = require('/usr/local/lib/node_modules/express');
var bodyParser = require('/usr/local/lib/node_modules/body-parser');
var session = require('/usr/local/lib/node_modules/express-session');
var passport = require('/usr/local/lib/node_modules/passport');
var LocalStrategy = require('/usr/local/lib/node_modules/passport-local').Strategy;

//라우터별로 분리하기 위해 express의 라우터 기능 사용//
var router = express.Router();

//POST를 적용하기 위한 설정//
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

//로그인(인증) - 정책은 local(소셜로그인 등 다양한 정책이 적용될 수 있다.)//
router.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/auth/loginSuccess',
        failureRedirect: '/auth/loginFailure'
    })
);

//로그인 성공(정상인증)//
router.get('/loginSuccess', function(request, response, next) {
    console.log('Successfully authenticated');
    console.log('session value: ' + request.session.passport.user); //passport 적용 시 세션값은 session.passport이다.//
    
    response.send('Successfully authenticated(main page go...)');
});

//로그인 실패(비정상 인증)//
router.get('/loginFailure', function(request, response, next) {
    console.log('Failed to authenticate');

    response.send('Failed to authenticate(login page return...)');
});

//passport 구성//
passport.serializeUser(function(username, done) {
    console.log('passport serializeUser call');

    //Session에 저장. 현재 세션은 Redis로 설정되어있음//
    done(null, username);
});
  
passport.deserializeUser(function(username, done) {
    console.log('passport deserializeUser call');
    //세션 호출 시 마다 call//
    done(null, username);
});

//정책에 따라 다양한 전략이 올 수 있다.//
passport.use(new LocalStrategy(function(username, password, done) {
    process.nextTick(function() {
        // Auth Check Logic
        console.log('login local strtegy check [' + username + '],[' + password + ']');

        //DB연동을 해서 정보를 비교할 수 있다.//
        if(username == 'scw3315' && password == '1234'){
            return done(null, username); //세션에 저장할 값을 넘긴다.(serializeUser)//
        } else{
            return done(false, null); //null로 보내 인증실패를 하게 설정//
        }

        return done(false, null);
    });
}));

module.exports = router; //모듈 적용//
