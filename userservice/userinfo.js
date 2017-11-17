var express = require('/usr/local/lib/node_modules/express');
var bodyParser = require('/usr/local/lib/node_modules/body-parser');
var async = require('/usr/local/lib/node_modules/async');
var assert = require('/usr/local/lib/node_modules/assert');

var MongoClient = require('/usr/local/lib/node_modules/mongodb').MongoClient;
var ObjectId = require('/usr/local/lib/node_modules/mongodb').ObjectID;

//라우터별로 분리하기 위해 express의 라우터 기능 사용//
var router = express.Router();

//MongoDB연동//
var url = 'mongodb://127.0.0.1:27017/memberdb'; //Mongodb URL(IP:PORT/Database)//

//POST를 적용하기 위한 설정//
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

//POST방식//
router.post('/getuserinfo', function(request, response){
    console.log('get user info service call');

   //몽고디비 연결//
    getUserInfo(request.body.username, response);
});

function getUserInfo(username, response)
{
    async.waterfall([
        //파일이 현재 저장소에 저장되어있는지 검사//
        function(callback){ //첫 시작은 하나의 callback으로 시작한다.//
            MongoClient.connect(url, function(err, db){
                assert.equal(null, err);

                console.log('Connected correctly to server');

                callback(null, db, username, 'success'); //콜백호출//
            });
        },
        //Task 2 : 등록된 사용자들의 정보를 불러온다.
        function(db, username, msg, callback){
            console.log('username: ' + username);

            //MongoDB에서 검색//
            //조회는 커서(Cursor)의 개념을 이용한다.//
            //조건절은 find()내부에 JSON형태로 작성한다.//
            //정렬조건은 find()외부에 JSON형태로 작성한다. (1은 오름차순, -1은 내림차순)//
            db.collection('memberdb', function(err, collection) {
                collection
                .find()
                .sort({
                    "username":1
                })
                //toArray를 이용해서 Document의 배열로 반환//
                .toArray(function(err, items) {
                    assert.equal(err, null);

                    console.log(items);

                    db.close(); //개방했으니 사용 후 닫아준다.//

                    callback(null, 'find ok...', items);
                });
            });
        }
    ],
    //Final Task : send
    function(callback, msg, items)
    {
        response.send(items);

        console.log('--------------------------');
    });
}

module.exports = router; //모듈 적용//