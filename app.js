const express = require("express");
const app = express();
const app_low = express();
const httpPort = 80;
const httpsPort = 443;
const port = 3000;
const http = require('http');
const https = require('https');
const fs = require('fs');
const connect = require("./schemas");
const bodyParser = require('body-parser')
const cors = require("cors");
connect();

// const options = {
//     key: fs.readFileSync('./server.key'),
//     cert: fs.readFileSync('./server.crt'),
//     ca: fs.readFileSync('./server.csr'),
// };

// const server = https.createServer( options, app );


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

//인증
app.get(
  "/.well-known/pki-validation/976C215CDA34EDF1D9A9F4F24AC439E5.txt",
  (req, res) => {
    res.sendFile(
      __dirname + 
      "/.well-known/pki-validation/976C215CDA34EDF1D9A9F4F24AC439E5.txt"
    );
  }
);

//https 리다이렉트
// app_low.use( (req, res, next ) => {
//   if(req.secure) {
//     next();
//   } else {
//     const to = `https://${req.hostname}:${httpsPort}${req.url}`;
//     console.log('to->', to);
//     res.redirect(to);
//   }
// })

app.get("/", async (req, res) => {
 console.log("main_page")    
 res.sendFile(__dirname + "/index.html");
});




//서버 열기
app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!");
  });

// http.createServer(app_low).listen(httpPort, () => {
//   console.log('http서버 on')
// });
// https.createServer(options, app).listen(httpsPort, () => {
//   console.log('https서버 on')
// });

  
module.exports = app
