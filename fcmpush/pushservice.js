var express = require('/usr/local/lib/node_modules/express');
var bodyParser = require('/usr/local/lib/node_modules/body-parser');
var async = require('/usr/local/lib/node_modules/async');
var assert = require('/usr/local/lib/node_modules/assert');
var FCM = require('/usr/local/lib/node_modules/fcm-push');
//라우터별로 분리하기 위해 express의 라우터 기능 사용//
var router = express.Router();

var serverKey = 'AAAApCUsCu8:APA91bELYfNL7z_XhYv_-4VZecJ3WtJr9iC1k_TItGWWOo3XtsbUFnTY0Nd_kuYf3ffkNj4HvKv8hCXMQpD0Cn9mYGkrY8eCdKfYr94VV9FXrEF6GT2vS-oNvfAZBgz2kIl8x5P-XE3a';
var fcm = new FCM(serverKey);

//POST를 적용하기 위한 설정//
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

//POST방식//
router.post('/sendmsg', function(request, response){
    console.log('fcm push send...');

   //몽고디비 연결//
    pushmsg(request.body.msg, response);
});

function pushmsg(pushmessage, response)
{
    async.waterfall([
        //메세지 생성//
        function(callback){ //첫 시작은 하나의 callback으로 시작한다.//

            var message = {
                to: 'eEcp1TKnBl0:APA91bEPreKP7tZAjB1JWLlXNl2tOZZpEq4xWCW8MN18WF8ortzB0KbSXc6nqkWDmGaD7kT35frRpRbc--X6K5-HwLUo3r4AYXV6CgxCORMsqz3MIW2y9oNxFSQQCnhSigiTvCD4KsDM', // required fill with device token or topics
                collapse_key: 'testpush', 
                data: {
                    your_custom_data_key: 'your_custom_data_value'
                },
                notification: {
                    title: 'Node.js pushtest',
                    body: pushmessage
                }
            };

            callback(null, message); //콜백호출//
        },
        //Task 2 : FCM 메세지 보내기
        function(message, callback){
            console.log(message);

            //callback style
            fcm.send(message, function(err, response){
                if (err) {
                    console.log("Something has gone wrong!");

                    callback(null, 'fail push...');
                } else {
                    console.log("Successfully sent with response: ", response);

                    callback(null, 'success push...');
                }
            });
        }
    ],
    //Final Task : send
    function(callback, msg)
    {
        response.send(msg);

        console.log('--------------------------');
    });
}

module.exports = router; //모듈 적용//