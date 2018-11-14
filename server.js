const User = require('./schema/schemaUser');
const passwordHash = require("password-hash");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
//Connexion à la base de donnée
mongoose.connect('mongodb://localhost/db').then(() => {
    console.log('Connected to mongoDB')
}).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
/*
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
*/

app.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

const account = require('./controllers/account/lib.js');

var router = express.Router();



router.post('/user/signup',function (req, res) {
    console.log("/user/signup: ", req.body);

    if (!req.body.email || !req.body.password) {
        res.status(400).json({
            "text": "Requête invalide"
        })
    } else {
        var user = {
            email: req.body.email,
            password: passwordHash.generate(req.body.password)
        };
        var findUser = new Promise(function (resolve, reject) {
            User.findOne({
                email: user.email
            }, function (err, result) {
                if (err) {
                    console.log(err);
                    reject(500);
                } else {
                    if (result) {
                        console.log(result);
                        reject(204)
                    } else {
                        resolve(true)
                    }
                }
            })
        });

        findUser.then(function () {
            var _u = new User(user);
            _u.save(function (err, user) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
                } else {
                    res.status(200).json({
                        "text": "Succès",
                        "token": user.getToken()
                    })
                }
            })
        }, function (error) {
            console.log(error);
            switch (error) {
                case 500:
                    res.status(500).json({
                        "text": "Erreur interne"
                    });
                    break;
                case 204:
                    res.status(204).json({
                        "text": "L'adresse email existe déjà"
                    });
                    break;
                default:
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
            }
        })
    }
});
router.post('/user/login',function (req, res) {
    console.log("/user/login: ", req.body);

    if (!req.body.email || !req.body.password) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        res.status(400).json({
            "text": "Requête invalide"
        })
    } else {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) {
                res.status(500).json({
                    "text": "Erreur interne"
                })
            } else if (!user) {
                res.status(401).json({
                    "text": "L'utilisateur n'existe pas"
                })
            } else {
                if (user.authenticate(req.body.password)) {
                    res.status(200).json({
                        "token": user.getToken(),
                        "text": "Authentification réussi"
                    })
                } else {
                    res.status(401).json({
                        "text": "Mot de passe incorrect"
                    })
                }
            }
        })
    }
});

app.use('/', router);

app.get('/',function signup(req, res) {
    res.send("Works");
});

var port = 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));
