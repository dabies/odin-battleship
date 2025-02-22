class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
        this.sunk = false;
    }

    hit() {
        this.hits++;
    }

    get isSunk() {
        if(this.hits >= this.length) {
            return true;
        }
        return false;
    }
}

class Gameboard {
    constructor() {
        this.width = 10;
        this.board = this.makeBoard(this.width);
    }

    makeBoard() {
        let width = this.width;
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
            console.log('Attack coordinates must be greater than or equal to 0, and less than or equal to 9.');
            return false;
        } else if(this.board[x][y] === 0) {
            console.log('You missed.');
            this.board[x][y] = 'miss';
            return true;
        } else if (this.board[x][y] === 'miss' || this.board[x][y] === 'hit') {
            console.log('That square has already been attacked');
            return false;
        } else {
            if(this.board[x][y] instanceof Ship) {
                this.board[x][y].hit();
                if(this.board[x][y].isSunk) {
                    console.log('You sunk a ship!');
                    this.board[x][y] = 'hit';
                    return true;
                }
                console.log('You hit a ship!');
                this.board[x][y] = 'hit';
                return true;
            }
            return false;
        }
    }

    getCoordinates(x, y, direction, length) {
        const coordinates = [];
        
        if(direction === 'vertical') {
            for(let i = 0; i < length; i++) {
                coordinates.push([x, y + i]);
            }
        } 
        
        else if(direction === 'horizontal') {
            for(let i = 0; i < length; i++) {
                coordinates.push([x + i, y]);
            }
        }
        return coordinates;
    }

    placeShip(ship, x, y, direction) {
        let length = ship.length;

        if(x < 0 || y < 0 || x > 9 || y > 9) {
            console.log('Attack coordinates must be larger than 0 and less than 9.');
            return false;
        }

        else if (direction !== 'vertical' && direction !== 'horizontal') {
            console.log("Invalid direction: Use 'horizontal' or 'vertical'.");
            console.log("Example: direction = 'horizontal'");
            return false;
        }

        const coordinates = this.getCoordinates(x, y, direction, length);

        if (!this.isPlacementValid(coordinates)) {
            console.log('Ship placement is invalid.');
            return false;
        }

        coordinates.forEach(([x, y]) => {
            this.board[x][y] = ship;
        })
    }

    isPlacementValid(coordinates) {
        for(let [x, y] of coordinates) {
            if(x < 0 || x > 9 || y < 0 || y > 9 || this.board[x][y] !== 0) {
                return false;
            }
        }
        return true;
    }

}

class Player {
    constructor(board) {
        this.board = board;
    }

    attack(x, y, opponentBoard) {
        return opponentBoard.receiveAttack(x,y);
    }

    generateRandomCoordinate() {
        let min = Math.ceil(0);
        let max = Math.floor(9);
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

    computerAttack(playerBoard) {
        let randomX = this.generateRandomCoordinate();
        let randomY = this.generateRandomCoordinate();
        let attacks = 0;

        while(this.attack(randomX, randomY, playerBoard) !== true && attacks < 300) {
            randomX = this.generateRandomCoordinate();
            randomY = this.generateRandomCoordinate();
            attacks++;
        }
        
        if(attacks >= 300) {
            console.log('Computer failed to find a valid target after 300 attempts.')
            return false;
        }
        return true;

    }
}

export { Ship, Gameboard, Player }