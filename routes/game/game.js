const express = require('express');
const router = express.Router();
const Game = require("../../schemas/game");

// skill logic


// user job 부여
router.post('/room/:roomNo', async (req, res) => {
    // 화면에서 정보 받아옴
    const userArr = req.body
    // console.log('user-->', userArr) // [{player_1 : ""}, ---]
    // console.log(userArr.length)
    // 각 user 직업 부여
    const job = [];
    // 1:citizen, 2:doctor, 3:police, 4:mapia
    switch (userArr.length) {
        case 4 :
            job.push(1,1,1,4);
            break;
        case 5 :
            job.push(1,1,1,2,4,);
            break;
        case 6 :
            job.push(1,1,2,3,4,4);
            break;
    };

    // job random 부여
    const jobArr = job.sort(() => Math.random() - 0.5);
    // console.log('jobArr->', jobArr);
    const playerJob = [];
    for (var i=0; i<jobArr.length; i++){
        if(jobArr[i] == 1){
            playerJob.push('citizen')
        }else if(jobArr[i] == 2){
            playerJob.push('doctor')
        }else if(jobArr[i] == 3){
            playerJob.push('police')
        }else if(jobArr[i] == 4){
            playerJob.push('mapia')
        };
    }
    // console.log('1.playerJob->', playerJob)

    for (var i=0; i<userArr.length; i++){
        // console.log('arr', userArr[i])
        userArr[i]['job'] = playerJob[i]
    }
    const player = userArr;
    // console.log('userArr-->', userArr)

    // DB 저장용 gameNo 부여
    const gameList = await Game.find({gameNo}).sort({ "gameNo": -1 });
    var gameNo = 0;
    if(gameList.length == 0 || gameList == null || gameList == undefined){
        gameNo = 1;
    }else{
        gameNo = gameList[0].gameNo+1
    }
    // console.log('gameNo->',gameNo)
    const gameInfo = await Game.create({gameNo, player})
    console.log('gameInfo-->', gameInfo)
    
    res.status(200).send({
        msg : 'player에게 직업이 부여되었습니다.',
        userArr
    }); 
});

// router.post('/room/:roomNo/skill', (req, res) => {
//     const voteResult = req.body;

// });

module.exports = router;