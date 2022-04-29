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

    for (var i=0; i<player.length; i++) {
        player[i]['userLife'] = 'save'
    }

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

// 밤, 낮 통신
router.post('/room/rull/:gameNo', async (req, res) => {
    const userSelect = req.body;
    // console.log('0', userSelect)
    const gameNo = userSelect[0].gameNo
    var msg='';

    //밤 (mapia, doctor, police)
    if(userSelect[1].citizen == undefined || userSelect[1].citizen == null){
        console.log('nigth')
        const mapiaSelect = userSelect[1].mapia;
        console.log('mapiaSelect-->', mapiaSelect)
        const doctorSelect = userSelect[1].doctor;
        console.log('doctorSelect-->', doctorSelect)

        const userArr = await Game.find({gameNo})
        // console.log('userArr-->', userArr)
        const player = userArr[0].player
        // const userLife = [];

        // mapia select -> die, doctor select -> save
        for (var i=0; i<player.length; i++) {
            // console.log('play[i]-->', player[i])
            // if(userSelcet.mapia == player)
            // console.log('_player-->', _player)
            for(var i=0; i<player.length; i++){
                var _player = Object.keys(player[i])
                console.log(_player)
                if(player[i].userLife == 'save') {
                    if(mapiaSelect == doctorSelect){
                        player[i]['userLife'] = 'save'
                        msg = '아무일도 일어나지 않았스...';
                    }else if(mapiaSelect == _player[0]){
                        player[i]['userLife'] = 'die'
                        console.log('mapiasel', player[i])
                        msg = '늑대가가 양을 죽였스...';
                        // console.log(player[i])
                    }else if(doctorSelect == _player[0]){
                        player[i]['userLife'] = 'save'
                    }
                    }
            }
        const nightResult = await Game.updateOne({gameNo}, {player:player})
        console.log('nightResult->', nightResult)
        console.log('usrLife-->', player);

        //승리 조건
        var citizenCnt = 0;
        var mapiaCnt = 0;
        for(var i=0; i<player.length; i++){
            if(player[i].userLife == 'save') {
                if(player[i].job == 'citizen' || player[i].job == 'doctor' || player[i].job == 'police'){
                    citizenCnt++
                }
                if(player[i].job == 'mapia'){
                    mapiaCnt++
                }
                // console.log('citizenCnt-->',citizenCnt);
                // console.log('mapiaCnt-->', mapiaCnt)
            }
        }
        if(citizenCnt == mapiaCnt || citizenCnt <= mapiaCnt){
            console.log("win or lose")

            for (var i=0; i<player.length; i++) {
                // console.log('play[i]-->', player[i])
                // if(userSelcet.mapia == player)
                var _player = Object.keys(player[i])
                // console.log('_player-->', _player)
                if(player[i].job == 'citizen' || player[i].job == 'doctor' || player[i].job == 'police'  ){
                    player[i]['result'] = 'lose'
                }
                if(player[i].job == 'mapia' ){
                    player[i]['result'] = 'win'
                    // console.log(player[i])
                }
            }
            const gameInfo = await Game.updateOne({gameNo}, {player:player})
            console.log('result-->', player)
            res.status(200).send({
                gameInfo,
                msg : 'gameover 늑대 승리~'
            })
            return;
        }    

        const gameInfo = await Game.updateOne({gameNo}, {player:player})
        console.log('result-->', player)
        console.log('gamaInfo', gameInfo)
        
        res.status(200).send({
            msg,
            gameInfo
        }); 
        }
    // 낮 --> citizen 투표
    }else if(userSelect[1].citizen !== undefined || userSelect[1].citizen !== null){
        console.log('dayVote')
        const citizenSelect = userSelect[1].citizen;
        const userArr = await Game.find({gameNo})
        const player = userArr[0].player
            for (var i=0; i<player.length; i++) {
                var _player = Object.keys(player[i])
                console.log('2313', _player)
                if(citizenSelect == _player[0] ){
                    msg = '';
                    player[i].userLife = 'die'
                    // console.log('ppp', player[i].job)
                    if(player[i].job == 'mapia'){
                        msg = '마피아를 검거하였스...'
                    }
                    if(player[i].job == 'citizen' || player[i].job == 'doctor' || player[i].job == 'police'){
                        msg = '선량한 시민이 죽어버렸스...'
                    }
                    
                }
                // 시민이 마피아 검거 또는 시민 죽였는지 확인하는 코드 작성할 것.
                // console.log('day player--> ', player[i])
            }
            // 승패 판별
            var citizenCnt = 0;
            var mapiaCnt = 0;
            for(var i=0; i<player.length; i++){
                if(player[i].userLife == 'save') {
                    if(player[i].job == 'citizen' || player[i].job == 'doctor' || player[i].job == 'police'){
                        citizenCnt++;
                    }else if(player[i].job == 'mapia'){
                        mapiaCnt++;
                    }
                    // console.log('citizenCnt-->',citizenCnt);
                    // console.log('mapiaCnt-->', mapiaCnt)
                }
            }
            if(mapiaCnt == undefined || mapiaCnt == 0 || mapiaCnt >= citizenCnt) {

                for (var i=0; i<player.length; i++) {
                    // console.log('play[i]-->', player[i])
                    // if(userSelcet.mapia == player)
                    var _player = Object.keys(player[i])
                    // console.log('_player-->', _player)
                    if(player[i].job == 'citizen' || player[i].job == 'doctor' || player[i].job == 'police'  ){
                        player[i]['result'] = 'win'
                    }else if(player[i].job == 'mapia' ){
                        player[i]['result'] = 'lose'
                        // console.log(player[i])
                    }
                }
                const gameInfo = await Game.updateOne({gameNo}, {player:player})
                console.log('result-->', player)
                res.status(200).send({
                    gameInfo,
                    msg : 'gameover 양 승리~'
                })
                return;
            }
            
        const gameInfo = await Game.updateOne({gameNo}, {player:player})
        console.log('result-->', player)
        console.log('gamaInfo', gameInfo)
        
        res.status(200).send({
            msg,
            gameInfo
        }); 
    }
});

module.exports = router;