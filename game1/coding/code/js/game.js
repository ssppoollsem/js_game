// 필요한 keycode만 관리
const key = {
    keyDown: {},
    keyValue: {
        37: 'left',
        39: 'right',
        88: 'attack'
    }
}

// 게임에 필요한 이벤트를 추가하고 관리
const windowEvent = () => {
    window.addEventListener('keydown', e => {
        // 키코드 확인
        // console.log(e.which) 
        
        key.keyDown[key.keyValue[e.which]] = true;
        hero.keyMotion();
    })
    
    window.addEventListener('keyup', e => {
        key.keyDown[key.keyValue[e.which]] = false;
        hero.keyMotion();

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
    loadImg();
    windowEvent();
}

// 모든 요소가 로드 된 후 게임실행
window.onload = () => {
    init();
}