//form-data(파일전송, multipart/form-data)//
var express = require('/usr/local/lib/node_modules/express');
var formidable = require('/usr/local/lib/node_modules/formidable');
var fs = require('/usr/local/lib/node_modules/fs-extra');
var bodyParser = require('/usr/local/lib/node_modules/body-parser'); //POST방식//
var util = require('/usr/local/lib/node_modules/util');
var os = require('/usr/local/lib/node_modules/os');

//라우터별로 분리하기 위해 express의 라우터 기능 사용//
var router = express.Router();
//FORM타입이므로 urlEncoder타입으로 하지 않는다.//

//POST설정//
router.use(bodyParser.json());

//받는 변수//
var fields = new Array();
var files = new Array();
var fields_array = new Array();
var files_array = new Array();

//파일저장형식(IP/PORT)//
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

var file_save_info = addresses[0]+':3000/';

//기본 post방식으로 전송//
router.post('/file_upload', function(request, response){
    var form = new formidable.IncomingForm(); //헤더를 만들어주는 역할이기에 밖에 있으면 안된다.(헤더 중첩에러 발생)//
    //업로드 정보(인코딩, 저장 디렉터리) 설정//
    form.encoding = 'utf-8'; //인코딩 타입 정의//
    form.uploadDir = '/Users/macbook/Desktop/programmingfile/nodejs/test_project/resources/upload'; //저장 디렉터리 지정//
    form.multiples = true; //request.files to be arrays of files//
    form.keepExtensions = true; //확장자 표시//

    //form타입 필드(text타입)에 따른 이벤트(콜백 방식으로 구성)//
    form.on('field', function(field, value){
        //console.log('[field]' + field, value);
        fields.push([field, value]);
        fields_array.push(value);
    //from타입 필드(file타입)에 따른 이벤트//
    }).on('file', function(field, file){
        //console.log('[file]' + field, file);
        fs.rename(file.path, form.uploadDir+ '/' + file.name); //파일의 이름 변경//

        files.push([field, file.name]);
        files_array.push(file.name);
    }).on('end', function() {
        //파일과 필드값이 모두 전송되었을 경우//
        console.log('----------<fields>----------');
        for(var i=0; i<fields_array.length; i++){
            console.log('fields[' + i + ']: ' + fields_array[i]);
        }
        console.log('----------<files>------------');
        for(var i=0; i<files_array.length; i++){
            console.log('files[' + i + ']: ' + files_array[i]);
        }
        console.log('-----------------------------');

        var trans_objeect = 
        {
            'field' : fields_array,
            'file' : files_array
        }

        response.send(trans_objeect);

        //초기화//
        fields = [];
        files = [];
        fields_array = [];
        files_array = [];
    }).on('error', function(error) {
        console.log('[error] error : ' + error);
    });

    form.parse(request, function(error, field, file) {
        // end 이벤트까지 전송되고 나면 최종적으로 호출되는 부분
        console.log('[parse()] error : ' + error + ', field : ' + field  + ', file : ' + file);
        console.log('upload succcess...');
    });
});

module.exports = router; //모듈 적용//