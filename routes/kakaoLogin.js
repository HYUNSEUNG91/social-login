const express = require('express');
const router = express.Router();
const request = require('request');
const rp = require('request-promise');

const kakao = {
    clientid: '6c9c16d27b420108ed23421696dfba3b', //REST API
    clientSecret: 'xL9jrO7CxPRbKAv4swgtguyGuQJOmuyD', //SECRET KEY
    redirectUri: 'http://localhost:3000/user/kakaoLogin'
}
// kakao login page URL
router.get('/kakao',(req,res)=>{
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakao.clientid}&redirect_uri=${kakao.redirectUri}`
    res.redirect(kakaoAuthURL);
});

router.get('/kakaoLogin', async (req,res) => {
    const { code } = req.query;
    console.log('code-->' , code);
    const options = {
        url : "https://kauth.kakao.com/oauth/token",
        method : 'POST',
        form: {
            grant_type: "authorization_code",
            client_id: kakao.clientid,
            redirect_uri: kakao.redirectUri,
            code: code
        },
        headers: {
            "content-type" : "application/x-www-form-urlencoded"
        },
        json: true
    }
   const token = await rp(options);
//    const access_token = token.access_token
//    const access_token = token.access_token
   console.log('access_token-->', token)

   res.status(200).send({
        token
   });
});

router.post('kakaoLogCheck', (req,res) => {
    const { token } = res.locals;
    console
})



module.exports = router;
