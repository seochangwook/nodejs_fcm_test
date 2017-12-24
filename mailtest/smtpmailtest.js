var express = require('/usr/local/lib/node_modules/express');
var bodyParser = require('/usr/local/lib/node_modules/body-parser');
var async = require('/usr/local/lib/node_modules/async');
var nodemailer = require('/usr/local/lib/node_modules/nodemailer');

//라우터별로 분리하기 위해 express의 라우터 기능 사용//
var router = express.Router();

//POST를 적용하기 위한 설정//
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

//Mail 계정설정//
var transporter = nodemailer.createTransport({
    service: 'naver',
    auth: {
      user: 'scw0531@naver.com',
      pass: 'tjckd246!ckd'
    }
});

//POST방식//
router.post('/trans', function(request, response){
    async.waterfall([
        function(callback){ //첫 시작은 하나의 callback으로 시작한다.//
            console.log('mail trans');
            
            var sendmailaddress = request.body.sendmailaddress;
            var tomailaddress = request.body.tomailaddress;
            var tomailaddresstwo = request.body.tomailaddresstwo;
            var mailsubject = request.body.mailsubject;
            var mailcontent = request.body.mailcontent;
         
            //Mail 설정 (attachments를 이용해서 파일전송도 가능)//
            var mailOptions = {  
                 from: sendmailaddress,
                 to: [
                     tomailaddress,
                     tomailaddresstwo
                 ],
                 subject: mailsubject,
                 text: mailcontent
             };

            callback(null, mailOptions); //콜백호출//
        },
        //Task 2 : Mail 보내기
        function(mailOptions, callback){
            transporter.sendMail(mailOptions, function(error, response){
                if (error){
                    console.log(error);
                } else {
                    console.log("Message sent : " + response.message);
                }
        
                transporter.close();

                callback(null, response.message);
            });
        }
    ],
    //Final Task : send
    function(callback, msg)
    {
        response.send('mail success...');

        console.log('--------------------------');
    });
});

module.exports = router; //모듈 적용//