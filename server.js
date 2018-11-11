// process.env.NODE_ENV = 'test';
require("./config");

// var firebase = require("firebase");
const path = require('path');
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
require("babel-polyfill");

var firebase_admin = require("firebase-admin");


var serviceAccount = require("./serviceAccountKey.json");

firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(serviceAccount),
    databaseURL: "https://livechat-73dad.firebaseio.com"
});


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

app.get(root + '/userinfo', (req, res) => {
    // console.log(randomRoomName);
    var db = firebase_admin.database();    
    // As an admin, the app has access to read and write all data, regardless of Security Rules
    var roomRef = db.ref('habit/');
    roomRef.once("value", function (habitList) {
        var habits = [];
        var count = 0;
        habitList.forEach(function(habit) {
            habits.push(habit.key);
        });
         
        res.render('userProfile.ejs', {habits: JSON.stringify(habits)});
    });    
  
});

app.post(root + '/userinfo', (req, res) => {
    if( req.body.updateProfile == "true" ) {
        console.log(req.body.displayName); 
        var db = firebase_admin.database(); 
        db.ref('users/' + req.body.uid).set({
            displayName: req.body.displayName,
        });
        var habitList = req.body.selectHabits;
        var bfood = 0;
        var bgame = 0;
        var bmovie = 0;
        var bsport = 0;
        var btravel = 0;
        for(var i=0;i<habitList.length;i++) {
            var habit = habitList[i];
            switch(habit) {
                case 'food':    bfood = 1;
                break;
                case 'game':    bgame = 1;
                break;
                case 'movie':    bmovie = 1;
                break;
                case 'sport':    bsport = 1;
                break;
                case 'travel':    btravel = 1;
                break;
                default:
                break;
            }
        }

        var postData = {
            food: bfood,
            game: bgame,
            movie: bmovie,
            sport: bsport,
            travel: btravel,
        };

        var db_path = `users/${req.body.uid}/habits`;
        var ref = db.ref(db_path);        
        ref.set(postData);
        res.send('updated');
    }
});


app.get(root + '/liveRoom', (req, res) => {
    res.redirect('/LAP');
});

app.get(root + '/liveRoom/:roomIndex', (req, res) => {
    var roomIndex = req.params.roomIndex;
    //get room Info from database
    var db = firebase_admin.database();
    var ref = db.ref("rooms/" + roomIndex);
    ref.once("value", function (room) {
        // console.log(room.val());
        res.render('liveRoom.ejs', { createNewRoom: false, roomIndex: roomIndex, speakerName: room.val().speakerName, roomName: room.val().roomName, roomJoinID: room.val().roomJoinID });
    });
});

app.post(root + '/liveRoom/:roomIndex', (req, res) => {
    if( req.body.speaker == "true" ) {
        //create new room
        var roomIndex = req.params.roomIndex;

        var db = firebase_admin.database();
        var ref = db.ref("rooms/" + roomIndex);

        ref.once("value", function (room) {
            // console.log(room.val());
            res.render('liveRoom.ejs', { createNewRoom: true, roomIndex: roomIndex, speakerName: room.val().speakerName, roomName: room.val().roomName, roomJoinID: room.val().roomJoinID });
        });
    } else if ( req.body.closeRoom )  {
        var db = firebase_admin.database();
        var roomRef = db.ref('rooms/' + req.body.roomIndex);
        roomRef.remove();
        res.send('deleted');
    } else if( req.body.closeRoomIfNot ) {
        var db = firebase_admin.database();
        var roomRef = db.ref('rooms/' + req.body.roomIndex);
        roomRef.remove();
        res.send('deleted');
    }
});

app.get(root + '/liveRoomList', (req, res) => {
    //get room list from database
    var db = firebase_admin.database();

    var ref = db.ref("rooms/");
    ref.once("value", function (roomList) {
        // console.log(roomList.val());
        
        var roomObjectList = [];
        roomList.forEach(function(room) {
            // console.log(room.key);//room name
            var roomObject = {
                roomIndex: room.key,
                roomName: room.val().roomName,
                roomJoinID: room.val().roomJoinID,
                speakerName: room.val().speakerName,
                roomDesc: room.val().roomDesc,
                roomTopic: room.val().roomTopic
            }
            roomObjectList.push(roomObject);
            // console.log(room.val().speakerName);     
        });

        res.render('liveRoomList.ejs', {roomList: JSON.stringify(roomObjectList)});
    });
});

app.post(root + '/liveRoomList', (req, res) => {
    if( req.body.createNewRoom ) {
        var userName = req.body.name;
        var uid = req.body.uid;
        var roomName = req.body.roomName;
        var roomDesc = req.body.roomDesc;
        var roomTopic = req.body.topic;
        //generate random string as room name
        var randomRoomID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        // console.log(randomRoomName);
        var db = firebase_admin.database();
        
        //get number of room created
        // As an admin, the app has access to read and write all data, regardless of Security Rules
        var roomRef = db.ref('rooms/');
        roomRef.once("value", function (roomList) {
            var count = 0;
            roomList.forEach(function(room) {
                count++;
            });

            var roomIndex = count+1;

            db.ref('rooms/' + roomIndex).set({
                roomName : roomName,
                roomJoinID: randomRoomID,
                speakerName: userName,
                speakerid: uid,
                roomDesc: roomDesc,
                roomTopic: roomTopic
            });  
            res.send(roomIndex.toString());

        });
    } 

});

app.get(root + '/notLogin', (req, res) => {
    res.render('notLogin.ejs');
});




app.listen(port, () => {
    console.log(`Started on port ${port}`);
});