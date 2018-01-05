var express = require('express')
var http = require('http')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var expressErrorHandler = require('express-error-handler')
var mongodb = require('mongodb')
var MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose')


var app = express()


app.set('port', process.env.PORT || 3000)

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}))

//데이터베이스 연결 
var database;

function connectDB() {

    mongoose.connect('mongodb://localhost:27017/local', function(err, db) {
        if (err) throw err;
        console.log("데이터베이스 연결")
        database = db
    })
}
// 회원가입
app.post('/process/signup', function(req, res) {
    console.log("회원가입 호출됨")

    var paramId = req.body.id
    var paramPassword = req.body.password
    var paramName = req.body.name

    var UserSchema = mongoose.Schema({
        id: { type: String, require: true, unique: true },
        password: { type: String, require: true, unique: true },
        name: { type: String }
    })

    var UserModel = mongoose.model("users", UserSchema)

    var person = new UserModel({ id: paramId, name: paramName, password: paramPassword });

    person.save(function(err, res) {
        if (err) {
            console.log("에러가 발생하였습니다")
            return;
        }
        console.log("user데이타 추가완료" + res)
    })


})

// 로그인 처리 함수
app.post('/process/login', function(req, res) {
    console.log('/process/login 호출됨.');

    var paramId = req.body.id;
    var paramPassword = req.body.password;

    if (database) {
        authUser(database, paramId, paramPassword, function(err, docs) {
            if (err) { throw err; }

            if (docs) {
                console.dir(docs);

                var username = docs[0].name;

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
                res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
                res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
                res.end();

            } else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인  실패</h1>');
                res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
                res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
                res.end();
            }
        });
    } else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }

});


// 사용자를 인증하는 함수
var authUser = function(database, id, password, callback) {
    console.log('authUser 호출됨.');

    // users 컬렉션 참조
    var users = database.collection('users');

    // 아이디와 비밀번호를 이용해 검색
    users.find({ "id": id, "password": password }).toArray(function(err, docs) {
        if (err) {
            callback(err, null);
            return;
        }

        if (docs.length > 0) {
            console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.', id, password);
            callback(null, docs);
        } else {
            console.log("일치하는 사용자를 찾지 못함.");
            callback(null, null);
        }
    });
}

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
    connectDB()
});