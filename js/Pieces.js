function randomPiece() {
    let r = randomN = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.x = 3;
    this.y = -2;
}
Piece.prototype.fill = function (color) {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}
Piece.prototype.draw = function () {
    this.fill(this.color);
}

Piece.prototype.unDraw = function () {
    this.fill(VACANT);
}
Piece.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
    }
}
Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}
Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

Piece.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            kick = -1;
        } else {
            kick = 1;
        }
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}
double_row.addEventListener('play', function () {
    if (!scoreMusic.paused) {
        scoreMusic.pause();
    } else {
        scoreMusic.play();
    }
});

Piece.prototype.lock = function () {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            if (this.y + r < 0) {
                for (r = 0; r < this.activeTetromino.length; r++) {
                    for (c = 0; c < this.activeTetromino.length; c++) {
                        if (!this.activeTetromino[r][c]) {
                            continue;
                        }
                        if (this.y + r < 0) {
                            for (r = 0; r < this.activeTetromino.length; r++) {
                                for (c = 0; c < this.activeTetromino.length; c++) {
                                    if (!this.activeTetromino[r][c]) {
                                        continue;
                                    }
                                    if (this.y + r < 0) {
                                        showGameOverMessage();
                                        scoreMusic.play();
                                        gameOver = true;
                                        pause = true;
                                        break;
                                    }
                                    board[this.y + r][this.x + c] = this.color;
                                }
                            }
                            gameOver = true;
                            break;
                        }
                        board[this.y + r][this.x + c] = this.color;
                    }
                }
                function showGameOverMessage() {
                    const gameOverMessage = document.getElementById('gameOverMessage');
                    gameOverMessage.classList.remove('hidden');
                }
                gameOver = true;
                break;
            }
            board[this.y + r][this.x + c] = this.color;
        }
    }
    for (r = 0; r < ROW; r++) {
        let isRowFull = true;
        for (c = 0; c < COL; c++) {
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if (isRowFull) {
            score_up.play();
            for (y = r; y > 1; y--) {
                for (c = 0; c < COL; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            for (c = 0; c < COL; c++) {
                board[0][c] = VACANT;
            }
            score += 10;

            function level_upp() {
                level += 1;
                dSpeed -= 80;
            }
            if (score === 100 || score === 200 || score === 300) {
                level_upp();
            } else if (score === 400 || score === 600 || score === 800) {
                level_upp();
                dSpeed -= 100;
                unstoppable.play();
            }
        }
    }

    drawBoard();
    scoreElement.innerHTML = score;
    leveladder.innerHTML = level;
}
Piece.prototype.collision = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            if (!piece[r][c]) {
                continue;
            }
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }
            if (newY < 0) {
                continue;
            }
            if (board[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}