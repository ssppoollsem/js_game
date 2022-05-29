// 게임에 필요한 클래스 작성

class Hero {
    // 생성자
    constructor(el) {
        this.el = document.querySelector(el);
        this.movex = 0; // 히어로 이동할 거리
        this.speed = 16; // 히어로 이동 속도
        //console.log(this.el.getBoundingClientRect()) // elenment에 크기 및 위치값
    }

    // 히어로의 움직임 변경
    keyMotion() {
        // 좌측, 우측 방향키
        if(key.keyDown['left']) {
            this.el.classList.add('run', 'flip');
            
            this.movex -= this.speed;
        }else if(key.keyDown['right']) {
            this.el.classList.add('run');
            this.el.classList.remove('flip');
            
            this.movex += this.speed;
        }

        // 공격키
        if(key.keyDown['attack']) {
            this.el.classList.add('attack');

            if (!bulletComProp.launch) {
                bulletComProp.arr.push(new Bullet());
                console.log(bulletComProp.arr.length)
                
                bulletComProp.launch = true;
            }
        }
        
        if(!key.keyDown['left'] && !key.keyDown['right']) {
            this.el.classList.remove('run');
        }

        if(!key.keyDown['attack']) {
            this.el.classList.remove('attack');

            bulletComProp.launch = false;
        }

        this.el.parentNode.style.transform = `translateX(${this.movex}px)`
    }

    // 히어로 위치값
    position() {
        return {
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
            bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
        }
    }

    // 히어로 사이즈
    size() {
        return  {
            width: this.el.offsetWidth,
            height: this.el.offsetHeight
        }
    }
}

// 수리검 클래스
class Bullet {
    constructor() {
        this.parentNode = document.querySelector('.game');
        this.el = document.createElement('div');
        this.el.className = 'hero_bullet';
        this.x = 0;
        this.y = 0;
        this.speed = 30; // 수리검의 속도
        this.distance = 0; // 수리검의 이동거리
        this.init();
    }

    init() {
        // 수리검 발사 위치
        this.x = hero.position().left + hero.size().width / 2;
        this.y = hero.position().bottom - hero.size().height / 2;
        this.distance = this.x;
        
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`
        this.parentNode.appendChild(this.el);
    }

    moveBullet() {
        this.distance += this.speed;

        this.el.style.transform = `translate(${this.distance}px, ${this.y}px)`;
    }
}