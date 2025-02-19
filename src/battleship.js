class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
        this.sunk = false;
    }

    hit() {
        this.hits++;
        return
    }

    get isSunk() {
        if(this.hits >= this.length) {
            return true;
        }
        return false;
    }
}

class Gameboard {
    constructor(width) {
        this.width = width;
        this.board = this.makeBoard(this.width);
    }

    makeBoard(width) {
        const board = []
        for(let i = 0; i < width; i++) {
            board[i] = [];
            for(let j = 0; j < width; j++) {
                board[i][j] = 0;
            }
        }
        return board;
    }

    receiveAttack(x , y) {
        if(x < 0 || y < 0 || x > 9 || y > 9) {
            console.log('Attack coordinates must be larger than 0 and less than 9.');
            return false;
        } else if(this.board[x][y] === 1) {
            console.log('That square has already been attacked.');
            return false;
        } else {
            this.board[x][y] = 1;
            return true;
        }
    }

}

export { Ship, Gameboard }