const express = require('express');
const router = express.Router();
const request = require('request');
const dotenv = require("dotenv").config();
const rp = require('request-promise');
const User = require("../schemas/user");


const kakao = {
    clientid: `${process.env.clientid}`, //REST API
    redirectUri	: 'http://localhost:3000/user/kakaoLogin'
}
// kakao login page URL
router.get('/kakao',(req,res)=>{
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakao.clientid}&redirect_uri=${kakao.redirectUri}`
    res.redirect(kakaoAuthURL);
});

router.get('/kakaoLogin', async (req,res) => {
    const { code } = req.query;
    // console.log('code-->' , code);
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
//    console.log('token', token)
   const options1 = {
        url : "https://kapi.kakao.com/v2/user/me",
        method : 'GET',
        headers: {
            Authorization: `Bearer ${token.access_token}`,
            'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
        },
        json: true
    }
    const userInfo = await rp(options1);
    // console.log('userInfo->', userInfo);
    const userId = userInfo.id;
    const userNick = userInfo.kakao_account.profile.nickname;
    // console.log('userId-->',userId);
    // console.log('userNick-->',userNick);
    const from = 'kakao'
    const user = new User({ userId, userNick, from})
    console.log('user-->',user);
    await user.save();

});




module.exports = router;
