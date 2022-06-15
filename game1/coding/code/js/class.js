// 게임에 필요한 클래스 작성

class Stage {
    constructor() {
        this.level = 0;
        this.isStart = false;
        this.stageStart();
    }

    // 스테이지 시작
    stageStart() {
        this.isStart = true;
        this.stageGuide(`START LEVEL${this.level + 1}`);
        this.callMonster();
    }

    stageGuide(text) {
        this.parentNode = document.querySelector('.game_app');
        this.textBox = document.createElement('div');
        this.textBox.className = 'stage_box';
        this.textNode = document.createTextNode(text);
        this.textBox.appendChild(this.textNode);
        this.parentNode.appendChild(this.textBox);

        setTimeout(() => {this.textBox.remove() }, 1500)
    }

    // 몬스터 등장
    callMonster() {
        for(let i=0; i<=10; i++) {
            if(i === 10) {
                allMonsterComProp.arr[i] = new Monster(stageInfo.monster[this.level].bossMon, hero.moveX + gameProp.screenWidth + 700 * i);
            }else {
                allMonsterComProp.arr[i] = new Monster(stageInfo.monster[this.level].defaultMon, hero.moveX + gameProp.screenWidth + 700 * i);
            }
        }
    }
    
    // 모든 몬스터 사냥했는지 체크
    clearCheck() {
        if(allMonsterComProp.arr.length === 0 && this.isStart) {
            this.isStart = false;
            this.level++;
            if(stageInfo.monster.length > this.level) {
                this.stageGuide('CLEAR!!');
                setTimeout(() => { this.stageStart() }, 2000);
                hero.heroUpgrade();
            } else {
                this.stageGuide('ALL CLEAR!!');
            }
        }
    }
}
class Hero {
    // 생성자
    constructor(el) {
        this.el = document.querySelector(el);
        this.moveX = 0; // 히어로 이동할 거리
        this.speed = 8; // 히어로 이동 속도
        this.direction = 'right'; // 히어로 방향
        this.attackDamage = 10000; // 히어로 공격력
        this.hpProgress = 0; // 히어로 체력바
        this.hpValue = 100000; // 히어로 체력
        this.defaultHpValue = this.hpValue;
        this.realDamage = 0;
        this.slideSpeed = 14; // 슬라이드 스피드
        this.slideTime = 0; // 슬라이드 진행시간
        this.slideMaxTime = 30; // 슬라이드 제한시간
        this.slideDown = false;
    }

    // 히어로의 움직임 변경
    keyMotion() {
        // 좌측, 우측 방향키
        if(key.keyDown['left']) {
            this.el.classList.add('run', 'flip');
            
            this.moveX = this.moveX <= 0 ? 0 : this.moveX - this.speed;
            this.direction = 'left';
        }else if(key.keyDown['right']) {
            this.el.classList.add('run');
            this.el.classList.remove('flip');
            
            this.moveX += this.speed;
            this.direction = 'right';
        }

        // 공격키
        if(key.keyDown['attack']) {
            this.el.classList.add('attack');

            if (!bulletComProp.launch) {
                bulletComProp.arr.push(new Bullet());
                bulletComProp.launch = true;
            }
        }

        // 슬라이드
        if(key.keyDown['slide']) {
            if(!this.slideDown) {
                this.el.classList.add('slide');

                if(this.direction === 'right') {
                    this.moveX += this.slideSpeed;
                }else {
                    this.moveX -= this.slideSpeed;
                }

                if(this.slideTime > this.slideMaxTime) {
                    this.el.classList.remove('slide');
                    this.slideDown = true;
                }
                this.slideTime++;
            }
        }
        
        if(!key.keyDown['left'] && !key.keyDown['right']) {
            this.el.classList.remove('run');
        }

        if(!key.keyDown['attack']) {
            this.el.classList.remove('attack');

            bulletComProp.launch = false;
        }

        if(!key.keyDown['slide']) {
            this.el.classList.remove('slide');
            this.slideTime = 0;
            this.slideDown = false;
        }

        this.el.parentNode.style.transform = `translateX(${this.moveX}px)`
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

    // 히어로 체력
    updateHp(monsterDamage) {
        this.hpValue = Math.max(0, this.hpValue - monsterDamage);
        this.hpProgress = this.hpValue / this.defaultHpValue * 100;

        const heroHpBox = document.querySelector('.state_box .hp > span');
        heroHpBox.style.width = this.hpProgress + '%';
        this.crash();

        if(this.hpProgress === 0) {
            this.dead();
        }
    }

    crash() {
        this.el.classList.add('crash');

        // 충돌 모션
        setTimeout(() => {
           this.el.classList.remove('crash') 
        }, 400);
    }

    // 히어로 죽었을 때
    dead() {
        this.el.classList.add('dead');
        endGame();
    }

    // 히어로 사이즈
    size() {
        return  {
            width: this.el.offsetWidth,
            height: this.el.offsetHeight
        }
    }

    // 히어로 데미지
    hitDamage() {
        this.realDamage = this.attackDamage - Math.floor(this.attackDamage * Math.random() * 0.1);
    }

    // 히어로 레벨업
    heroUpgrade() {
        this.speed += 1.3;
        this.attackDamage += 15000;
    }
}

// 수리검 클래스
class Bullet extends Hero {
    constructor() {
        super()
        this.parentNode = document.querySelector('.game');
        this.el = document.createElement('div');
        this.el.className = 'hero_bullet';
        this.x = 0;
        this.y = 0;
        this.speed = 30; // 수리검의 속도
        this.distance = 0; // 수리검의 이동거리
        this.bulletDirection = 'right'; // 수리검을 생성할 때의 방향 체크
        this.init();
    }

    init() {
        // 수리검을 생성할 때의 방향 체크
        this.bulletDirection = hero.direction === 'left' ? this.bulletDirection = 'left' : this.bulletDirection = 'right';
        // 수리검 발사 위치
        this.x = this.bulletDirection === 'right' ? hero.moveX + hero.size().width / 2 : hero.moveX - hero.size().width / 2;
        this.y = hero.position().bottom - hero.size().height / 2;
        this.distance = this.x;
        
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`
        this.parentNode.appendChild(this.el);
    }

    moveBullet() {
        let setRotate = '';

        if(this.bulletDirection === 'left') {
            this.distance -= this.speed;
            setRotate = 'rotate(180deg)';
        } else {
            this.distance += this.speed
        }
        
        this.el.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`;
        this.crashBullet();
    }

    // 수리검 충돌여부 체크
    crashBullet() {
        for(let j = 0; j < allMonsterComProp.arr.length; j++) {
            // 수리검이 몬스터 충돌여부
            if(super.position().left > allMonsterComProp.arr[j].position().left && super.position().right < allMonsterComProp.arr[j].position().right) {
                hero.hitDamage();
                this.el.remove();
                bulletComProp.arr.shift();
                this.damageView(allMonsterComProp.arr[j]);
                allMonsterComProp.arr[j].updateHp(j); // 몬스터 체력 업데이트
            }
        }

        if(super.position().left > gameProp.screenWidth || super.position().right < 0 ) {
            this.el.remove();
            bulletComProp.arr.shift();
        }
    }

    // 데미지 
    damageView(monster) {
        this.parentNode = document.querySelector('.game_app');
        this.textDamageNode = document.createElement('div');
        this.textDamageNode.className = 'text_damage';
        this.textDamage = document.createTextNode(hero.realDamage);
        this.textDamageNode.appendChild(this.textDamage);
        this.parentNode.appendChild(this.textDamageNode);
        
        let textPosition = Math.random() * -100; // 텍스트 데미지 왼쪽으로 약간 이동
        let damagex = monster.position().left + textPosition; // 몬스터 x좌표 위치
        let damagey = monster.position().top; // 몬스터 y좌표 위치

        this.textDamageNode.style.transform = `translate(${damagex}px, ${-damagey}px)` // 텍스트 데미지 위치

        setTimeout(() => {this.textDamageNode.remove()}, 500) // 텍스트 데미지 엘리먼트 제거
    }
}

// 몬스터 클래스
class Monster {
    constructor(property, positionX) {
        // console.log(property)
        this.parentNode = document.querySelector('.game');
        this.el = document.createElement('div');
        this.el.className = `monster_box ${property.name}`;
        this.elChildren = document.createElement('div');
        this.elChildren.className = 'monster';
        this.hpNode = document.createElement('div');
        this.hpNode.className = 'hp';
        this.hpValue = property.hpValue;
        this.defaultHpValue = property.hpValue; // 최초 몬스터의 체력
        this.hpInner = document.createElement('span');
        this.progress = 0;
        this.positionX = positionX;
        this.moveX = 0; // 몬스터의 이동거리
        this.speed = property.speed; // 몬스터의 이동속도
        this.crashDamage = property.crashDamage; // 몬스터 충돌 데미지
        this.score = property.score;

        this.init();
    }

    init() {
        this.hpNode.appendChild(this.hpInner);
        this.el.appendChild(this.hpNode);
        // 몬스터 생성
        this.el.appendChild(this.elChildren);
        this.parentNode.appendChild(this.el);
        this.el.style.left = `${this.positionX}px`;
    }

    position() {
        return {
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
            bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
        }
    }

    // 몬스터 체력
    updateHp(index) { // index : 해당하는 몬스터 
        this.hpValue = Math.max(0, this.hpValue - hero.realDamage);
        this.progress = this.hpValue / this.defaultHpValue * 100;
        this.el.children[0].children[0].style.width = `${this.progress}%`; // 몬스터 체력바

        if(this.hpValue === 0) {
            this.dead(index)
        }
    }

    // 몬스터 체력 0 일 경우
    dead(index) {
        this.el.classList.add('remove');
        setTimeout(() => { this.el.remove() }, 200);
        allMonsterComProp.arr.splice(index, 1);
        this.setScore();
    }

    // 몬스터 이동
    moveMonster() {
        if (this.moveX + this.positionX + this.el.offsetWidth - hero.moveX + hero.position().left <= 0) {
            this.moveX = hero.moveX - this.positionX + gameProp.screenWidth - hero.position().left
        } else {
            this.moveX -= this.speed;
        }
        this.el.style.transform = `translateX(${this.moveX}px)`;
        this.crash();
    }

    // 몬스터 히어로 충돌 여부체크
    crash() {
        let rightDiff = 30; // 히어로 우측 여백
        let leftDiff = 70; // 히어로 왼쪽 여백
        if(hero.position().right - rightDiff > this.position().left && hero.position().left + leftDiff < this.position().right) {
            hero.updateHp(this.crashDamage);
        }
    }

    // 점수체크
    setScore() {
        stageInfo.totalScore += this.score;
        document.querySelector('.score_box').innerText = stageInfo.totalScore;
    }
}