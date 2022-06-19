// 필요한 keycode만 관리
const key = {
    keyDown: {},
    keyValue: {
        37: 'left',
        39: 'right',
        88: 'attack',
        32: 'slide',
        13: 'enter'
    }
}

// 전체 몬스터 배열 관리
const allMonsterComProp = {
    arr: []
}

// 생성된 수리검 관리할 배열 생성
const bulletComProp = {
    arr: [],
    launch: false, // 수리검 모션중인지 체크
}

// 전체 npc 배열 관리
const allNpcComProp = {
    arr: []
}

const gameBackground = {
    gameBox: document.querySelector('.game')
}

// 자주 사용되는 값들 전역 처리
const gameProp = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    gameOver: false
}

// 게임 스테이지 관리
const stageInfo = {
    stage: [],
    totalScore: 0,
    monster: [
        {defaultMon: greenMon, bossMon: greenMonBoss},
        {defaultMon: yellowMon, bossMon: yellowMonBoss},
        {defaultMon: pinkMon, bossMon: pinkMonBoss},
        {defaultMon: pinkMon, bossMon: zombieKing},
    ],
    callPosition: [3000, 7000, 14000, 21000] // 몬스터 소환 포지션
}

// 키모션 딜레이 제거
const renderGame = () => {
    hero.keyMotion();
    setGameBackground();

    allNpcComProp.arr.forEach((arr,i) => {
        arr.crash();
    })
    bulletComProp.arr.forEach((arr, i) => {
        arr.moveBullet();
    })
    allMonsterComProp.arr.forEach((arr, i) => {
        arr.moveMonster();
    })
    stageInfo.stage.clearCheck();
    window.requestAnimationFrame(renderGame); // 재귀호출
}

// 게임 종료
const endGame = () => {
    gameProp.gameOver = true;
    key.keyDown.left = false; // endGame 함수 실행시 강제로 키 막기
    key.keyDown.right = false; // endGame 함수 실행시 강제로 키 막기

    const gameOver = document.createElement('div');
    
    gameOver.classList.add('game_over');
    gameOver.innerHTML += "<p>게임오버</p>";
    if(!document.querySelector('.game_over')) {
        document.querySelector('.game_app').appendChild(gameOver);
    }
}

// 배경이미지 패럴럭스
const setGameBackground = () => {
    // Math.min 수식에 값이 0보다 크면 0을 넣으주고 0보다 작으면 -값이 들어간다.
    let parallaxValue = Math.min(0, -(hero.moveX - gameProp.screenWidth / 3));

    gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`;
}

// 게임에 필요한 이벤트를 추가하고 관리
const windowEvent = () => {
    window.addEventListener('keydown', e => {
        // 키코드 확인
        // console.log(e.which) 

        if(gameProp.gameOver === false) key.keyDown[key.keyValue[e.which]] = true;
        if(key.keyDown['enter']) {
            allNpcComProp.arr.forEach((arr,i) => {
                arr.talk();
            })
        }
    })
    
    window.addEventListener('keyup', e => {
        key.keyDown[key.keyValue[e.which]] = false;
    })

    // 브라우저 리사이즈
    window.addEventListener('resize', e => {
        gameProp.screenWidth = window.innerWidth;
        gameProp.screenHeight = window.innerHeight;
    })
}

const loadImg = () => {
    // 미리 로드 할 백그라운드 이미지
    const preLoadImgSrc = ['/game1/lib/images/ninja_attack.png', '/game1/lib/images/ninja_run.png', '/game1/lib/images/ninja_slide.png']

    preLoadImgSrc.forEach(arr => {
        const img = new Image();
        img.src = arr;
    })
}

let hero;
let npcOne;
let npcTwo;

// 프로그램 시작에 필요한 함수 또는 메소드
const init = () => {
    hero = new Hero('.hero');
    stageInfo.stage = new Stage();
    npcOne = new Npc(levelQuest);
    npcTwo = new Npc(levelQuestTwo);
    allNpcComProp.arr.push(npcOne, npcTwo);

    loadImg();
    windowEvent();
    renderGame();
}

// 모든 요소가 로드 된 후 게임실행
window.onload = () => {
    init();
}