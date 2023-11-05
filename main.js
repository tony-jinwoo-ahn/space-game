let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 612;
canvas.height = 612;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false;

let enemyWidth = 48;
let enemyHeight = 48;
let gameOverImageWidth = 612;
let gameOverImageHeight = 612;

let spaceshipWidth = 48;
let spaceshipHeight = 48;
let spaceshipX = (canvas.width / 2) - (spaceshipWidth/2);
let spaceshipY = canvas.height - spaceshipHeight;

let bulletList = []
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = spaceshipX + 12;
        this.y = spaceshipY;
        bulletList.push(this);
    }
    this.update = function() {
        this.y -= 10;
    }
}

let enemyList = []
function Enemy() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = Math.floor(Math.random() * (canvas.width - enemyWidth));
        enemyList.push(this);
    }
    this.update = function() {
        this.y += 5;
        if (this.y >= canvas.height - enemyHeight) {
            gameOver = true;
            console.log("game over");
        }
    }
}

function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src = "images/background.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png";

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.png";
}

let keysDown = {}
function setupKeyboardListener() {
    document.addEventListener("keydown",function(event){
        keysDown[event.key] = true;
    });
    document.addEventListener("keyup",function(event){
        delete keysDown[event.key];
        if (event.code == "Space") {
            createBullet();
        }
    })
}

function createBullet() {
    let b = new Bullet();
    b.init();
}

function createEnemy() {
    const interval = setInterval(function() {
        let e = new Enemy();
        e.init();
    }, 1000);
}

function update() {
    if ("ArrowRight" in keysDown) {
        if (spaceshipX < canvas.width-spaceshipWidth) {
            spaceshipX += 5;
        }
    } 
    if ("ArrowLeft" in keysDown) {
        if (spaceshipX > 0) {
            spaceshipX -= 5;
        }
    }
    for (let i=0 ; i<bulletList.length ; i++) {
        bulletList[i].update();
    }
    for (let i=0 ; i<enemyList.length ; i++) {
        enemyList[i].update();
    }
}

function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    for (let i=0 ; i<bulletList.length ; i++) {
        ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
    for (let i=0 ; i<enemyList.length ; i++) {
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
}

function showGameOver() {
    ctx.drawImage(gameOverImage, 0, 0, gameOverImageWidth, gameOverImageHeight);
}

function main() {
    if (gameOver) {
        showGameOver();
        return;
    }
    update();
    render();
    requestAnimationFrame(main);
}

loadImage();
setupKeyboardListener();
createEnemy();
main();