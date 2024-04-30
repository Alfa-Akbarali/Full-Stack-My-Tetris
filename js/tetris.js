const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

const ROW = 20;
const COL = (COLUMN = 10);
const SQ = (squareSize = 30);
const VACANT = ("rgba(21, 76, 121)");
let audio = document.getElementById("mp3");
const scoreMusic = document.getElementById("over_voice");
const score_up = document.getElementById("score_up");
const double_row = document.getElementById("double_row");
const unstoppable = document.getElementById("unstoppable");
const pauseclick = document.getElementById("pauseclick");
const pausesecond = document.getElementById("pausesecond");
const volume = document.getElementById("volume");
const VolumeChanger = document.getElementById("volumechanger");
const repload = document.getElementById("repload");

const leveladder = document.getElementById("level");
let currentVolume = 1;
let pause = false;

let score = 0;
let level = 1;
let SpeedG = 900;
let p = randomPiece();

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    ctx.strokeStyle = "#000";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}
let board = [];
for (r = 0; r < ROW; r++) {
    board[r] = [];
    for (c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}
function drawBoard() {
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}
drawBoard();

function displayPausedMessage() {
    var message = document.createElement("div");
    message.textContent = "Game Paused";
    message.style.cssText = `
      position: absolute;
      top: 50%;
      left: 45%;
      transform: translate(-50%, -50%);
      font-size: 2.5rem;
      font-family: sans-serif;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.7);
      color: #ffffff;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0px 1px 10px rgba(0, 0, 255, 0.5);
        text-shadow: 2px 2px 5px rgba(0, 0, 255, 0.5);
      animation: pulse 1s ease-in-out infinite alternate;
      @keyframes pulse {
        from {
          transform: scale(1);
        }
        to {
          transform: scale(1.1);
        }
      }
    `;
    document.body.appendChild(message);
}

function pauseGame() {
    if (pause) {
        pause = false;
        drop();
        document.body.removeChild(document.body.lastChild);
        pausesecond.preload = 'auto';
        pausesecond.load();
        pausesecond.play();
        pausesecond.volume = 0.3;
        audio.volume = 1;
    } else {
        pause = true;
        displayPausedMessage();
        pauseclick.preload = 'auto';
        pauseclick.load();
        pauseclick.play();
        pauseclick.volume = 0.3;
        audio.volume = 0;
    }
}

document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if (!pause) {
        if (event.keyCode == 37 || event.keyCode == 65) {
            p.moveLeft();
        } else if (event.keyCode == 38 || event.keyCode == 87) {
            p.rotate();
        } else if (event.keyCode == 39 || event.keyCode == 68) {
            p.moveRight();
        } else if (event.keyCode == 40 || event.keyCode == 83) {
            p.moveDown();
        } else if (event.keyCode == 77) {
            toggleMusic();
        }
    }
    if (event.keyCode == 27 || event.keyCode == 80) {
        pauseGame();
    }
    if (event.keyCode == 82) {
        window.location.reload();
    }
}

let dropStart = Date.now();
let gameOver = false;

function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > SpeedG) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver && !pause) {
        requestAnimationFrame(drop);
    }
}

drop();

function toggleMusic() {
    if (audio.paused) {
        audio.preload = 'auto';
        audio.load();
        audio.play();
        showVolumeIndicator();
    } else {
        audio.pause();
        audio.currentTime = 0;
        volumeIndicator.style.display = "none";
    }
    let img = document.getElementById('volume_icon');
    if (img.src.match("./img/volume.png")) {
        img.src = "./img/mute.png";
        audio.volume = 0;
        volume.load();
        volume.play();
        volume.volume = 0.2;
    } else {
        img.src = "./img/volume.png";
        audio.volume = 1;
        VolumeChanger.load();
        VolumeChanger.play();
        VolumeChanger.volume = 0.3;
    }
}
function changeVolume(delta) {
    currentVolume = Math.max(0, Math.min(1, currentVolume + delta));
    audio.volume = currentVolume;
    VolumeChanger.load();
    VolumeChanger.play();
    VolumeChanger.volume = 0.3;
    updateVolumeIndicator();
    showVolumeIndicator();
}
function updateVolumeIndicator() {
    volumeIndicator.textContent = Math.round(currentVolume * 100) + "%";
}
function showVolumeIndicator() {
    volumeIndicator.style.display = "block";
    setTimeout(function () {
        volumeIndicator.style.display = "none";
    }, 4300);
}