var express = require('/usr/local/lib/node_modules/express');
var bodyParser = require('/usr/local/lib/node_modules/body-parser');
var session = require('/usr/local/lib/node_modules/express-session');

//라우터별로 분리하기 위해 express의 라우터 기능 사용//
var router = express.Router();

//POST를 적용하기 위한 설정//
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

//GET방식//
router.get('/endpoint_get', function(request, response){
    var id = request.query.id;

    console.log('session key value: ' + request.session.key);

    response.send('id(get): '+id);
});

//POST방식//
router.post('/endpoint_post', function(request, response){
    var id = request.body.id;

    //관련 작업하기//
    if(id == 'scw0531')
    {
        data_trans(response);
    }

    else{
        response.send('id(post): '+id);
    }
});
///////////////////////
function data_trans(response)
{
    //자바스크립트 객체를 JSON으로 변환(JSON형식을 만든다.)//
    var accountstrObj = 
    {
        "name":"John",
        "members":["Sam", "Smith"],
        "number":123456,
        "location":"seoul"
    }   

    var accountstrStr = JSON.stringify(accountstrObj); //string으로 반환//

    console.log(accountstrStr); //JSON반환//
    response.send(accountstrStr);
}

module.exports = router; //모듈 적용//