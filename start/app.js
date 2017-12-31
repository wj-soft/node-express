var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var main = require('./router/main')

app.listen(3000, function() {
    console.log("start express server on port 3000")
});

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.use('/main', main) //라우터연결

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/form', function(req, res) {
    res.sendFile(__dirname + '/public/form.html')
})


app.post('/email_post', function(req, res) {
    res.render('email.ejs', { 'email': req.body.email })
        // res.render('email.ejs', { 'email': req.body.email })  값이 undifined
})

app.post('/ajax_send_email', function(req, res) {
    console.log(req.body.email);
    var responseData = { 'result': 'OK', 'email': req.body.email }
    res.json(responseData)
})