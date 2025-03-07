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

const CONFIG = {
    SHIP_LENGTHS: [2, 3, 3, 4, 5],
    BOARD_SIZE: 10,
    MAX_ATTEMPTS: 300,
};

class Gameboard {
    constructor() {
        this.width = CONFIG.BOARD_SIZE;
        this.board = this.makeBoard(this.width);
        this.sunkenShips = 0;
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

    resetBoard() {
        this.board = this.makeBoard(this.width);
        this.sunkenShips = 0;
    }

    receiveAttack(x , y) {
        if(x < 0 || y < 0 || x > 9 || y > 9) {
            console.log('Attack coordinates must be greater than or equal to 0, and less than or equal to 9.');
            return false;
        } else if(this.board[x][y] === 0) {
            console.log('You missed.');
            this.board[x][y] = 'miss';
            return 'miss';
        } else if (this.board[x][y] === 'miss' || this.board[x][y] === 'hit') {
            console.log('That square has already been attacked');
            return false;
        } else {
            if(this.board[x][y] instanceof Ship) {
                this.board[x][y].hit();
                if(this.board[x][y].isSunk) {
                    this.sunkenShips++;
                    this.board[x][y] = 'hit';
                    return 'sunk';
                }
                console.log('You hit a ship!');
                this.board[x][y] = 'hit';
                return 'hit';
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
        return true;
    }

    getRandomDirection() {
        return Math.random() < 0.5 ? 'horizontal' : 'vertical';
    }

    generateRandomCoordinate() {
        let min = Math.ceil(0);
        let max = Math.floor(9);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    randomizeShipPlacements() {
        const ships = CONFIG.SHIP_LENGTHS.map((length) => {
            return new Ship(length);
        });

        for(const ship of ships) {
            let x = this.generateRandomCoordinate();
            let y = this.generateRandomCoordinate();
            let direction = this.getRandomDirection();
            let tries = 0;
            while(!this.placeShip(ship, x, y, direction) && tries < CONFIG.MAX_ATTEMPTS) {
                x = this.generateRandomCoordinate();
                y = this.generateRandomCoordinate();
                direction = this.getRandomDirection();
                tries++;
            }

            if(tries >= CONFIG.MAX_ATTEMPTS) {
                console.log('Computer failed to find a valid placement after maximum attempts.')
                return false;
            }    
        }
        return true;
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
    constructor(name, board) {
        this.board = board;
        this.name = name;
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
        let attacks = 0;

        while (attacks < 300) {
            let randomX = this.generateRandomCoordinate();
            let randomY = this.generateRandomCoordinate();
    
            const attackResult = this.attack(randomX, randomY, playerBoard);
    
            if (attackResult !== false) {
                return attackResult;
            }
    
            attacks++;
        }
        
        if(attacks >= 300) {
            console.log('Computer failed to find a valid target after 300 attempts.')
            return false;
        }
    }
}

export { Ship, Gameboard, Player }