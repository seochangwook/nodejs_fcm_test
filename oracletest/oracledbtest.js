var express = require('/usr/local/lib/node_modules/express');
var bodyParser = require('/usr/local/lib/node_modules/body-parser');
var oracledb = require('/usr/local/lib/node_modules/oracledb');
var dbConfig = require('/Users/macbook/Desktop/programmingfile/nodejs/test_project/oracletest/dbconfig');

//오라클 오토커밋 설정//
oracledb.autoCommit = true;

//라우터별로 분리하기 위해 express의 라우터 기능 사용//
var router = express.Router();

//POST를 적용하기 위한 설정//
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

//SELECT//
router.post('/dbtestselect', function(request, response){
    //내부적으로 Async/Await, Promises, Callback을 지원//
    oracledb.getConnection({
        user          : dbConfig.user,
        password      : dbConfig.password,
        connectString : dbConfig.connectString
    }, 
    function(err, connection){
        if (err) {
            console.error(err.message);
            return;
        }
        console.log('==> userlist search query');

        var query = 
            'SELECT USER_NO, USER_NAME, USER_AGE, USER_IMAGE, USER_ROLE ' +
            'FROM USERINFO';
        
        //SQL문 실행//
        connection.execute(query, function(err, result){
            if (err) {
                console.error(err.message);

                doRelease(connection);
                return;
            }

            console.log(result.rows);
        
            //Async, Promise적으로 처리//
            doRelease(connection, result.rows);
        });
    });
    
    //DB연결해제//
    function doRelease(connection, userlist){
        connection.close(function(err){
            if (err){
                console.error(err.message);
            }
            
            //DB종료까지 모두 완료되었을 시 최종적으로 응답 데이터 반환//
            console.log('list size: ' + userlist.length);
            
            for(var i=0; i<userlist.length; i++){
                console.log('name: ' + userlist[i][1]);
            }

            response.send(userlist);
        });
    };
});

//INSERT//
router.post('/dbtestinsert', function(request, response){
    //내부적으로 Async/Await, Promises, Callback을 지원//
    oracledb.getConnection({
        user          : dbConfig.user,
        password      : dbConfig.password,
        connectString : dbConfig.connectString
    }, 
    function(err, connection){
        if (err) {
            console.error(err.message);
            return;
        }
        console.log('==> userlist insert query');

        //PrepareStatement구조//
        var query = 
            'INSERT INTO USERINFO(USER_NO, USER_NAME, USER_AGE, USER_IMAGE, USER_ROLE) ' +
            'VALUES (:USER_NO, :USER_NAME, :USER_AGE, :USER_IMAGE, :USER_ROLE)';
        var binddata = [
            Number(request.body.userno), 
            request.body.username,
            Number(request.body.userage),
            request.body.userimage,
            request.body.userrole
        ];
        
        //SQL문 실행//
        connection.execute(query, binddata, function(err, result){
            if (err) {
                console.error(err.message);

                doRelease(connection);
                return;
            }

            console.log('Rows Insert: ' + result.rowsAffected);
        
            //Async, Promise적으로 처리//
            doRelease(connection, result.rowsAffected);
        });
    });
    
    //DB연결해제//
    function doRelease(connection, result){
        connection.close(function(err){
            if (err){
                console.error(err.message);
            }
            
            //DB종료까지 모두 완료되었을 시 최종적으로 응답 데이터 반환//
            response.send(''+result);
        });
    };
});

//DELETE//
router.post('/dbtestdelete', function(request, response){
    //내부적으로 Async/Await, Promises, Callback을 지원//
    oracledb.getConnection({
        user          : dbConfig.user,
        password      : dbConfig.password,
        connectString : dbConfig.connectString
    }, 
    function(err, connection){
        if (err) {
            console.error(err.message);
            return;
        }
        console.log('==> userlist delete query');

        //PrepareStatement구조//
        var query = 
            'DELETE FROM USERINFO ' +
            'WHERE USER_NAME = :USER_NAME';
        var binddata = [
            request.body.username
        ];
        
        //SQL문 실행//
        connection.execute(query, binddata, function(err, result){
            if (err) {
                console.error(err.message);

                doRelease(connection);
                return;
            }

            console.log('Rows Delete: ' + result.rowsAffected);
        
            //Async, Promise적으로 처리//
            doRelease(connection, result.rowsAffected);
        });
    });
    
    //DB연결해제//
    function doRelease(connection, result){
        connection.close(function(err){
            if (err){
                console.error(err.message);
            }
            
            //DB종료까지 모두 완료되었을 시 최종적으로 응답 데이터 반환//
            response.send(''+result);
        });
    };
});

module.exports = router; //모듈 적용//