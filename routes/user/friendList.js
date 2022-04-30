const express = require('express');
const router = express.Router();
const User = require("../../schemas/user");
const authMiddleWare = require("../../middleware/authMiddleWare");


router.post('/friendList', authMiddleWare, async (req, res) => {
    console.log('friendList router');
    //friend id
    const { userId } = req.body;
    const friendUserId = userId
    console.log('userId->', friendUserId);
    
    const { user } = res.locals;
    // console.log('user->', user);
    const loginUser = user[0].userId
    console.log('loginUser->', loginUser)

    const list = await User.find({userId : loginUser});
    console.log('list-->', list);
    const friendList = list[0].friendList;
    console.log('friendList1->',friendList)

    // 친구추가 중복검사 추가할 것.
    // var friendListValue = Object.values(friendList)
    // console.log('231', friendListValue)


    // for(var i=0; i<friendList.length; i++){
    //     console.log('1-list', friendList[i])
    // }

    friendList.push({userId : friendUserId});
    console.log('friendList2->',friendList)

    const update = await User.updateOne({userId : loginUser},{friendList:friendList});
    console.log('update->', update)
    console.log('friendList3->',friendList)
    res.status(200).send({
        friendList,
    })


});

module.exports = router;