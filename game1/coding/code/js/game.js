// 필요한 keycode만 관리
const key = {
    keyDown: {},
    keyValue: {
        37: 'left',
        39: 'right',
        88: 'attack'
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

const gameBackground = {
    gameBox: document.querySelector('.game')
}

// 자주 사용되는 값들 전역 처리
const gameProp = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
}

// 키모션 딜레이 제거
const renderGame = () => {
    hero.keyMotion();
    setGameBackground();
    
    bulletComProp.arr.forEach((arr, i) => {
        arr.moveBullet();
    })
    window.requestAnimationFrame(renderGame); // 재귀호출
}

// 배경이미지 패럴럭스
const setGameBackground = () => {
    // Math.min 수식에 값이 0보다 크면 0을 넣으주고 0보다 작으면 -값이 들어간다.
    let parallaxValue = Math.min(0, -(hero.movex - gameProp.screenWidth / 3));

    gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`;
}

// 게임에 필요한 이벤트를 추가하고 관리
const windowEvent = () => {
    window.addEventListener('keydown', e => {
        // 키코드 확인
        // console.log(e.which) 
        
        key.keyDown[key.keyValue[e.which]] = true;
        // hero.keyMotion();
    })
    
    window.addEventListener('keyup', e => {
        key.keyDown[key.keyValue[e.which]] = false;
        // hero.keyMotion();
    })

    // 브라우저 리사이즈
    window.addEventListener('resize', e => {
        gameProp.screenWidth = window.innerWidth;
        gameProp.screenHeight = window.innerHeight;
    })
}

const loadImg = () => {
    // 미리 로드 할 백그라운드 이미지
    const preLoadImgSrc = ['/game1/lib/images/ninja_attack.png', '/game1/lib/images/ninja_run.png']

    preLoadImgSrc.forEach(arr => {
        const img = new Image();
        img.src = arr;
    })
}

let hero;

// 프로그램 시작에 필요한 함수 또는 메소드
const init = () => {
    hero = new Hero('.hero');
    allMonsterComProp.arr[0] = new Monster(700, 7777);
    allMonsterComProp.arr[1] = new Monster(1500, 5555);
    loadImg();
    windowEvent();
    renderGame();
}

// 모든 요소가 로드 된 후 게임실행
window.onload = () => {
    init();
}