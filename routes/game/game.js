const express = require('express');
const router = express.Router();
const Game = require("../../schemas/game");

// result logic


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

    // gameNo 부여
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
        gameInfo
    }); 
});

router.post('/room/rull/:gameNo', async (req, res) => {
    const userSelect = req.body;
    console.log('0', userSelect)
    const gameNo = userSelect[0].gameNo

    //밤 (mapia, doctor, police)
    if(userSelect[1].citizen == undefined || userSelect[1].citizen == null){
        const mapiaSelect = userSelect[1].mapia;
        const doctorSelect = userSelect[1].doctor;
        const userArr = await Game.find({gameNo})
        // console.log('userArr-->', userArr)
        const player = userArr[0].player
        // const userLife = [];

        // mapia select -> die, doctor select -> save
        for (var i=0; i<player.length; i++) {
            // console.log('play[i]-->', player[i])
            // if(userSelcet.mapia == player)
            var _player = Object.keys(player[i])
            // console.log('_player-->', _player)
            if(mapiaSelect == doctorSelect ){
                player[i]['userLife'] = 'save'
            }else if(mapiaSelect == _player[0]){
                player[i]['userLife'] = 'die'
                // console.log(player[i])
            }else if(doctorSelect == _player[0]){
                player[i]['userLife'] = 'save'
            }else{
                player[i]['userLife'] = 'save'
            }
        }
            // console.log('night player-->', player)

        const gameInfo = await Game.updateOne({gameNo}, {player:player})
        console.log('result-->', player)
        console.log('gamaInfo', gameInfo)
        
        res.status(200).send({
            msg : 'hmm.....',
            gameInfo
        }); 

    }else if(userSelect[1].citizen !== undefined || userSelect[1].citizen !== null){
        const citizenSelect = userSelect[1].citizen;
        const userArr = await Game.find({gameNo})
        const player = userArr[0].player
        var citizenCnt = 0;
        var mapiaCnt = 0;
        var gameResult ="";
            for (var i=0; i<player.length; i++) {
                var _player = Object.keys(player[i])
                if(citizenSelect == _player[0] ){
                    player[i].userLife = 'die'
                }
                // console.log('day player--> ', player[i])
                if(player[i].userLife == 'save') {

                    if(player[i].job == 'citizen' || player[i].job == 'doctor' || player[i].job == 'police'){
                        citizenCnt++;
                        console.log('citizenCnt-->',citizenCnt)
                    }
                }
            }

            
        const gameInfo = await Game.updateOne({gameNo}, {player:player})
        console.log('result-->', player)
        console.log('gamaInfo', gameInfo)
        
        res.status(200).send({
            msg : 'citizen...',
            gameInfo
        }); 
    }
});

module.exports = router;