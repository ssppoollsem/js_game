// 게임에 필요한 클래스 작성

class Hero {
    // 생성자
    constructor(el) {
        this.el = document.querySelector(el);
        console.log(this.el)
    }

    // 히어로의 움직임 변경
    keyMotion() {
        // 좌측, 우측 방향키
        if(key.keyDown['left']) {
            this.el.classList.add('run');
            this.el.classList.add('flip');
        }else if(key.keyDown['right']) {
            this.el.classList.add('run');
            this.el.classList.remove('flip');
        }

        // 곻격키
        if(key.keyDown['attack']) {
            this.el.classList.add('attack')
        }
        
        if(!key.keyDown['left'] && !key.keyDown['right']) {
            this.el.classList.remove('run')
        }

        if(!key.keyDown['attack']) {
            this.el.classList.remove('attack')
        }
    }
}