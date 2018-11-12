const account = require('./account/lib.js');

module.exports = function (app) {
    app.post('user/login',account.login);
    app.post('user/signup',account.signup);
};