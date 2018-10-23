// process.env.NODE_ENV = 'test';
require("./config");

var firebase = require("firebase");
const path = require('path');
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
require("babel-polyfill");

var config_firebase = {
    apiKey: process.env.firebase_apiKey,
    authDomain: process.env.firebase_authDomain,
    databaseURL: process.env.firebase_databaseURL,
    storageBucket: process.env.firebase_storageBucket,
};

firebase.initializeApp(config_firebase);

const port = process.env.PORT;

// set the view engine to ejs
app.set('view engine', 'ejs');

var root = '/LAP';
// Set static folder.
app.use(root, express.static(path.join(__dirname, '/views')));

// Body parser middleware.
app.use(bodyParser.json());			// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

//DashBoard
app.get('/', (req, res) => {
    res.redirect('/LAP');
    // res.render('dashboard');
});
//DashBoard
app.get(root, (req, res) => {
    //check login or not
    var userinfo = getUserInfo();
    res.render("dashboard.ejs", { userinfo: JSON.stringify(userinfo) });
});

app.get(root + '/signup', (req, res) => {
    var userinfo = getUserInfo();
    res.render('signup.ejs', { userinfo: JSON.stringify(userinfo) });
});

app.post(root + '/signup', (req, res) => {
    var redirect = '/LAP';
    var errorMessage = '';   
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (user) {
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: name
            }).then(function() {
                // Update successful.
                res.json({ errorMessage: errorMessage, redirect:redirect});
            });
        }, function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            errorMessage = `${error.message}\n Code: ${errorCode}`;
            res.json({ errorMessage: errorMessage, redirect:redirect});
        });
});

app.get(root + '/signIn', (req, res) => {
    var userinfo = getUserInfo();
    res.render('signin.ejs', { userinfo: JSON.stringify(userinfo) });
});

app.post(root + '/signIn', (req, res) => {
    var redirect = '/LAP';
    var errorMessage = '';
    var email = req.body.email;
    var password = req.body.password;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (user) {
            res.json({ errorMessage: errorMessage, redirect:redirect});
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            errorMessage = `${error.message}\n Code: ${errorCode}`;
            res.json({ errorMessage: errorMessage, redirect:redirect});
        });
});

app.get(root + '/signout', (req, res) => {
    var userinfo = getUserInfo();
    res.render('signout.ejs');
});

app.post(root + '/signout', (req, res) => {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        res.redirect('/');
    }).catch(function (error) {
        // An error happened
        console.log(error);
        res.redirect('/');
    });
});

app.get(root + '/liveRoom', (req, res) => {
    // var userinfo = getUserInfo();
    // // res.render('signout.ejs');
    // var database = firebase.database();
    // var userId = userinfo.uid;
    // var roomID = 1;
    // firebase.database().ref('chats/' + roomID).set({
    //     username: '123',
    //     email: '456',
    //   });

    // var starCountRef = firebase.database().ref('users/' + userId);
      
    var userinfo = getUserInfo();
    res.render('liveRoom.ejs', { userinfo: JSON.stringify(userinfo) });
});


function getUserInfo() {
    var userinfo = {};
    var user = firebase.auth().currentUser;
    if (user) {
        // User is signed in.
        userinfo.isLogin = true;
        userinfo.name = user.displayName;
        userinfo.email = user.email;
        userinfo.uid = user.uid;
    } else {
        // No user is signed in.
        userinfo.isLogin = false;
    }

    return userinfo;
}


app.listen(port, () => {
    console.log(`Started on port ${port}`);
});