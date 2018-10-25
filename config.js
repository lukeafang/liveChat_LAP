var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 8001;
  process.env.firebase_apiKey = "AIzaSyC9BYgGylmyMowSRQSyA7Cnh3eLHCZUY-s";
  process.env.firebase_authDomain = "livechat-73dad.firebaseapp.com";
  process.env.firebase_databaseURL = "https://livechat-73dad.firebaseio.com";
  process.env.firebase_storageBucket = "livechat-73dad.appspot.com";
} else if (env === 'test') {
  process.env.PORT = 8002;
  process.env.firebase_apiKey = "AIzaSyC9BYgGylmyMowSRQSyA7Cnh3eLHCZUY-s";
  process.env.firebase_authDomain = "livechat-73dad.firebaseapp.com";
  process.env.firebase_databaseURL = "https://livechat-73dad.firebaseio.com";
  process.env.firebase_storageBucket = "livechat-73dad.appspot.com";
}