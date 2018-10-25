// process.env.NODE_ENV = 'test';
require("./config");

// var firebase = require("firebase");
const path = require('path');
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
require("babel-polyfill");


// var config_firebase = {
//     apiKey: process.env.firebase_apiKey,
//     authDomain: process.env.firebase_authDomain,
//     databaseURL: process.env.firebase_databaseURL,
//     storageBucket: process.env.firebase_storageBucket,
// };

// firebase.initializeApp(config_firebase);

const port = process.env.PORT;

// set the view engine to ejs
app.set('view engine', 'ejs');

var root = '/LAP';
// Set static folder.
app.use(root, express.static(path.join(__dirname, '/views')));

// Provide access to node_modules folder from the client-side
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

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
    // var userinfo = getUserInfo();
    // res.render("dashboard.ejs", { userinfo: JSON.stringify(userinfo) });
    res.render("dashboard.ejs");
});


app.get(root + '/signIn', (req, res) => {
    res.render('signin.ejs');
});

app.get(root + '/signup', (req, res) => {
    res.render('signup.ejs');
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
    
    res.render('liveRoom.ejs');
});

app.get(root + '/notLogin', (req,res) => {
    res.render('notLogin.ejs');
});




app.listen(port, () => {
    console.log(`Started on port ${port}`);
});