let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let spaceshipWidth = 48;
let spaceshipHeight = 48;
let spaceshipX = (canvas.width / 2) - (spaceshipWidth/2);
let spaceshipY = canvas.height - spaceshipHeight;

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
    })
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
}

function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
}

function main() {
    update();
    render();
    requestAnimationFrame(main);
}

console.log("12");
loadImage();
setupKeyboardListener();
main();