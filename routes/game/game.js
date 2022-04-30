const express = require('express');
const router = express.Router();
const Game = require("../../schemas/game");
const User = require("../../schemas/user");

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

// 밤, 낮 통신 --> userWin, userLose User정보에 count 추가할 것.
router.post('/room/rull/:gameNo', async (req, res) => {
    const userSelect = req.body;
    console.log('0', userSelect)
    const gameNo = userSelect[0].gameNo
    var msg='';
    var poilceMsg = '';

    //밤 (mapia, doctor, police)
    if(userSelect[1].citizen == undefined || userSelect[1].citizen == null){
        console.log('nigth')
        const mapiaSelect = userSelect[1].mapia;
        console.log('mapiaSelect-->', mapiaSelect)
        const doctorSelect = userSelect[1].doctor;
        console.log('doctorSelect-->', doctorSelect)
        const policeSelect = userSelect[1].police;
        console.log('policeSelect-->', policeSelect)

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
                var _playerValue = Object.values(player[i])
                console.log(_playerValue)
                if(player[i].userLife == 'save') {
                    if(mapiaSelect == doctorSelect){
                        player[i]['userLife'] = 'save'
                        msg = '아무일도 일어나지 않았스...';
                    }
                    if(mapiaSelect == _playerValue[0]){
                        player[i]['userLife'] = 'die'
                        // console.log('22',player[key])
                        console.log('mapiasel', _playerValue[0])
                        msg = '늑대가가 양을 죽였스...';
                        // console.log(player[i])
                    }
                    if(doctorSelect == _playerValue[0]){
                        player[i]['userLife'] = 'save'
                    }
                    if(policeSelect == _playerValue[0]){
                        if(player[i].job == 'mapia'){
                            console.log('info',_playerValue[0])
                            poilceMsg = _playerValue[0]+'님은 늑대 입니다.'
                        }else{
                            poilceMsg = _playerValue[0]+'님은 늑대가 아닙니다.'
                        }
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
            console.log('mapiaCnt-->', mapiaCnt)
            console.log('citizenCnt-->', citizenCnt)

            for (var i=0; i<player.length; i++) {
                // console.log('play[i]-->', player[i])
                // if(userSelcet.mapia == player)
                // console.log('_player-->', _player)
                if(player[i].job == 'citizen' || player[i].job == 'doctor' || player[i].job == 'police'  ){
                    player[i]['result'] = 'lose'
                }
                if(player[i].job == 'mapia' ){
                    player[i]['result'] = 'win'
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
            poilceMsg,
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
                var _playerValue = Object.values(player[i])
                if(citizenSelect == _playerValue[0] ){
                    msg = '';
                    player[i].userLife = 'die'
                    // console.log('ppp', player[i].job)
                    if(player[i].job == 'mapia'){
                        msg = '마피아 '+_playerValue[0]+'를 검거하였스...'
                    }
                    if(player[i].job == 'citizen' || player[i].job == 'doctor' || player[i].job == 'police'){
                        msg = '선량한 시민 '+_playerValue[0]+'가 죽어버렸스...'
                    }
                }
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
                console.log("win or lose")
                console.log('mapiaCnt-->', mapiaCnt)
                console.log('citizenCnt-->', citizenCnt)

                for (var i=0; i<player.length; i++) {
                    // console.log('play[i]-->', player[i])
                    // if(userSelcet.mapia == player)
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