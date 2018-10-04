var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 8001;
  process.env.firebase_apiKey = "";
  process.env.firebase_authDomain = "";
  process.env.firebase_databaseURL = "";
  process.env.firebase_storageBucket = "";
} else if (env === 'test') {
  process.env.PORT = 8002;
  process.env.firebase_apiKey = "";
  process.env.firebase_authDomain = "";
  process.env.firebase_databaseURL = "";
  process.env.firebase_storageBucket = "";}