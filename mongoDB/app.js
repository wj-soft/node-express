var mongoose = require('mongoose')
var mongodb = require('mongodb')


mongoose.connect('mongodb://localhost:27017/local')

// var db = mongoose.connection

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback() {
//     console.log("mongo db connection OK.");
// })

var UserSchema = mongoose.Schema({
    id: { type: Number, require: true, unique: true },
    name: { type: String }
})

var UserModel = mongoose.model("users", UserSchema)

var lee = new UserModel({ id: 3, name: "kim" });

lee.save(function(err, res) {
    if (err) {
        console.log("에러가 발생하였습니다")
        return;
    }
    console.log("데이터베이스에 추가되었음" + res)
})


var result;

UserModel.find(function(err, res) {
    if (err) {
        console.log("에러가 발생하였습니다")
        return;
    }
    result = res;
    console.log(result)
})