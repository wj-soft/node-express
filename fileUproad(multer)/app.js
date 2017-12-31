var express = require('express')
var bodyParser = require('body-parser')

//파일업로드
var multer = require('multer')
var _storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})
var upload = multer({ storage: _storage })


var fs = require('fs')
var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'jade')

app.listen(3000, function() {
    console.log("start express server on port 3000")
});


app.get('/upload', function(req, res) {
    res.render('upload')
})

app.post('/upload', upload.single('userfile'), function(req, res) {
    //req는 파일 프로퍼티를 만들고 여기에 파일객체를 할당함  req.file
    res.send('uploaded')
})