const express = require("express");
const app = express();
const port = 3000;

// const http = require('http')
// const https = require('https');
// const fs = require('fs');
// const http_port = 3000;
// const https_port = 8443;

const connect = require("./schemas");
const bodyParser = require('body-parser')
const cors = require("cors");
connect();

// const options = {
//   key: fs.readFileSync(__dirname+'/private.pem', 'utf-8'),
//   cert: fs.readFileSync(__dirname+'/public.pem', 'utf-8')
// };


// cors
app.use(cors());

// router -> user
const usersRouter = require("./routes/user/login");
const resisterRouter = require("./routes/user/register");
const kakaoRouter = require('./routes/user/kakaoLogin');
const findPwRouter = require('./routes/user/findPw');
const changePwRouter = require('./routes/user/changePw');
const freindListRouter = require('./routes/user/friendList')
// router -> game
const gameRouter = require('./routes/game/game');
//webCam
const webcamRouter = require('./routes/webCam/webCam');

//middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extends: true })) 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/user', [ usersRouter, resisterRouter, findPwRouter, changePwRouter, freindListRouter ]);
app.use('', [kakaoRouter] )
app.use('/game', [gameRouter] )
app.use('/cam', [webcamRouter] );


app.get("/", async (req, res) => {
 console.log("main_page")    
 res.sendFile(__dirname + "/index.html");
});



//서버 열기
app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!");
  });
// http.createServer(app).listen(http_port);
// https.createServer(options, app).listen(https_port);

  
module.exports = app
