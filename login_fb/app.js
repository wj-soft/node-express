var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;


passport.use(new FacebookStrategy({
        clientID: '',
        clientSecret: '',
        callbackURL: "/auth/facebook/callback"

        //스콥
            profileFields: ['id', 'email', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
        // profile = {id:'111111'} 값을 가지고 사용자를 서버(로컬)에 추가함.
        var authId = 'facebook:' + profile.id;

        //사용자가 기존서버에 추가되어있는지 확인하기
        for (var i = 0; i < users.length; i++) {
            if (user.authId === authId) {
                return done(null, user)
            }
        }

        var newuser = {
            'authId': authId,
            'dislpayName': profile.displayName
        }
        users.push(newuser)
        done(null, newuser)

        User.findOrCreate(..., function(err, user) {
            if (err) { return done(err); }
            done(null, user);
        });
    }
));

app.get('/', function(req, res) {
    var output = `
    <a href="/auth/facebook">페이스북</a>
    `
})

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/welcome',
        failureRedirect: '/auth/facebook'
    }));