var express = require('express')
var http = require('http')

var app = express();

app.set('port', process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'), function() {
    console.log('익스프레스 서버를 시작했습니다 : ' + app.get('port'))
})

app.use(function(req, res) {
    res.send('<h1>hello world</h1>')
})