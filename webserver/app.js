var http = require('http');

var server = http.createServer();

var port = 3000;
server.listen(port, function() {
    console.log('웹서버가 시작되었습니다. : %d', port)
})