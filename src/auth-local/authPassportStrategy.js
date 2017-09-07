import passportLocal from 'passport-local';
import request from 'request';
import _ from 'lodash';
const LocalStrategy = passportLocal.Strategy;

/* eslint-disable no-console */
export default new LocalStrategy({
    username: 'username',
    password: 'password'
}, (username, password, done) => {

    request.post("http://www.mocky.io/v2/5808862710000087232b75ac", function(err, res, body) {
        console.log('Im auth');
        if (!err && res.statusCode === 200) {
            console.log('Im auth success');
            processUser(body, username, password, function(err, user) {
                if (user) {
                    console.log('returning user');
                    done(null, user);
                } else {
                    done(null, false, 'Incorrect email or password');
                }
            });
        }
        else{
            console.log('Im auth failed');
            done(null, false, 'Server error');
        }
    });

});

const processUser = (users,username, password, callback) => {
    //If the pass is 1234 your user will pass
    console.log('username ', username);
    console.log('password ', password);

    if (password == 1234) {
        // process input
        let usersParsed = JSON.parse(users);
        let user = _.find(usersParsed.clients, {'email': username});
        // console.log('User found ', user);
        callback(null, user);
    }
    else{
        callback("Wrong password");
    }
};