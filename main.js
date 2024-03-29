let gameSpeed = 3;

let refreshButton = document.getElementById("refreshButton");
refreshButton.addEventListener("click", function() {
    location.reload();
});

let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 350;
canvas.height = 600;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false;
let score = 0;

let enemyWidth = 48;
let enemyHeight = 48;
let gameOverImageWidth = 356;
let gameOverImageHeight = 200;

let spaceshipWidth = 48;
let spaceshipHeight = 48;
let spaceshipX = (canvas.width / 2) - (spaceshipWidth/2);
let spaceshipY = canvas.height - spaceshipHeight;

let bulletList = []
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.alive = true;
    this.init = function() {
        this.x = spaceshipX + 12;
        this.y = spaceshipY;
        bulletList.push(this);
    }
    this.update = function() {
        this.y -= 10;
        if (this.y <= 0) {
            this.alive = false;
        }
    }
    this.checkHit = function() {
        if (!this.alive) return;
        for (let i = 0; i < enemyList.length; i++) {
            if (!enemyList[i].alive) continue;
            if (this.y <= enemyList[i].y && enemyList[i].x <= this.x && this.x <= (enemyList[i].x + enemyWidth)) {
                score++;
                this.alive = false;
                enemyList[i].alive = false;
                createCollision(this.x, this.y);
            }
        }
    }
}

function killAll() {
    for (let i = 0; i < enemyList.length; i++) {
        if (!enemyList[i].alive) continue;
        score += 100;
        enemyList[i].alive = false;
        createCollision(enemyList[i].x, enemyList[i].y);
    }
}

let collisionList = []
function Collision() {
    this.x = 0;
    this.y = 0;
    this.drawed = false;
    this.init = function(x, y) {
        this.x = x;
        this.y = y;
        collisionList.push(this);
    }
}

let enemyList = []
function Enemy() {
    this.x = 0;
    this.y = 0;
    this.alive = true;
    this.init = function() {
        this.x = Math.floor(Math.random() * (canvas.width - enemyWidth));
        enemyList.push(this);
    }
    this.update = function() {
        if (this.alive) {
            this.y += 10;
            if (this.y > spaceshipY - enemyHeight && spaceshipX < this.x + enemyWidth && this.x < spaceshipX + spaceshipWidth) {
                createCollision((this.x + spaceshipX) / 2, (this.y + spaceshipY) / 2);
                gameOver = true;
            }
        }
        if (this.y >= canvas.height) {
            this.alive = false;
            score--;
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

    fireImage = new Image();
    fireImage.src = "images/fire.png";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.jpeg";
}

let keysDown = {}
function setupKeyboardListener() {
    document.addEventListener("keydown",function(event){
        keysDown[event.key] = true;
    });
    document.addEventListener("keyup",function(event){
        delete keysDown[event.key];
        if (event.code == "Space") {
            event.preventDefault();
            createBullet();
        }
        if (event.code == "Digit0") {
            event.preventDefault();
            killAll();
        }
    })
}

function createBullet() {
    let b = new Bullet();
    b.init();
}

function createEnemy() {
    if (1 <= gameSpeed && gameSpeed <= 10) {
        setInterval(function () {
            let e = new Enemy();
            e.init();
        }, gameSpeed * 100);
    }
}

function createCollision(x, y) {
    let c = new Collision();
    c.init(x, y);
}

function update() {
    if ("ArrowRight" in keysDown) {
        if (spaceshipX < canvas.width - spaceshipWidth) {
            spaceshipX += 5;
        }
    }
    if ("ArrowLeft" in keysDown) {
        if (spaceshipX > 0) {
            spaceshipX -= 5;
        }
    }
    for (let i=0 ; i<bulletList.length ; i++) {
        if (bulletList[i].alive) {
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }
    for (let i=0 ; i<enemyList.length ; i++) {
        if (enemyList[i].alive) {
            enemyList[i].update();
        }
    }
}

function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    for (let i=0 ; i<bulletList.length ; i++) {
        if (bulletList[i].alive) {
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }
    }
    for (let i=0 ; i<enemyList.length ; i++) {
        if (enemyList[i].alive) {
            ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
        }
    }
    for (let i=0 ; i<collisionList.length ; i++) {
        if (collisionList[i].drawed) continue;
        ctx.drawImage(fireImage, collisionList[i].x, collisionList[i].y);
        setInterval(function() {
            collisionList[i].drawed = true;
        }, 150);
    }
}

function showGameOver() {
    ctx.drawImage(gameOverImage, 0, canvas.height/2 - gameOverImageHeight/2, gameOverImageWidth, gameOverImageHeight);
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

function startGame() {
    loadImage();
    setupKeyboardListener();
    createEnemy();
    main();
}

startGame();