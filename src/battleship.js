//class for handling ships
class Ship {
    //initialize ships with length provided, and set hits to zero and not being sunk
    constructor(length) {
        this.length = length;
        this.hits = 0;
        this.sunk = false;
    }

    //simple function to increase the hits on the ship
    hit() {
        this.hits++;
    }

    //getter method that determines if a ship is sunk by comparing its length to hits taken
    get isSunk() {
        if(this.hits >= this.length) {
            return true;
        }
        return false;
    }
}

//config for methods, allows easier customization down the road 
const CONFIG = {
    SHIP_LENGTHS: [2, 3, 3, 4, 5],
    BOARD_SIZE: 10,
    MAX_ATTEMPTS: 300,
};

//class for handling all gameboard related activity
class Gameboard {
    //constructor, takes in variables from config, and keeps track of sunken ships on board
    constructor() {
        this.width = CONFIG.BOARD_SIZE;
        this.board = this.makeBoard(this.width);
        this.sunkenShips = 0;
    }

    //function to make gameboard, two for loops to create an array of arrays (width x width)
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
     //function to reset board after game completion. resets sunken ships, and makes a new board
    resetBoard() {
        this.board = this.makeBoard(this.width);
        this.sunkenShips = 0;
    }

    //function that handles attacks
    receiveAttack(x , y) {
        //check to make sure attack placement is within bounds of board
        if(x < 0 || y < 0 || x > this.width - 1 || y > this.width - 1) {
            console.log('Attack coordinates must be greater than or equal to 0, and less than or equal to 9.');
            return false;
        //if board value is zero, it is unoccupied and thus a miss
        } else if(this.board[x][y] === 0) {
            console.log('You missed.');
            this.board[x][y] = 'miss';
            return 'miss';
        //if board value is miss or hit, then that square has already been attacked and move is rejected
        } else if (this.board[x][y] === 'miss' || this.board[x][y] === 'hit') {
            console.log('That square has already been attacked');
            return false;
        //if we reach this point, then we know they are attacking a ship
        } else {
            if(this.board[x][y] instanceof Ship) {
                //register hit on ship
                this.board[x][y].hit();
                //check if this hit sunk the ship, if it did we update sunken ship total of the board
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

    //this is a function that returns the coordinates of a ship that has been placed
    //if ship is vertical, the y value is increasing, and vice versa
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

    //function for placing ships on gameboard
    placeShip(ship, x, y, direction) {
        let length = ship.length;

        //ensures that ship is placed within board limits
        if(x < 0 || y < 0 || x > this.width - 1 || y > this.width - 1) {
            return false;
        }

        //ensures that a valid direction is provided
        else if (direction !== 'vertical' && direction !== 'horizontal') {
            console.log("Invalid direction: Use 'horizontal' or 'vertical'.");
            console.log("Example: direction = 'horizontal'");
            return false;
        }

        //using getCoordinates function to get the coordinates of the ship placement
        const coordinates = this.getCoordinates(x, y, direction, length);

        //makes sure that all coordinates are valid and ship doesnt extend off of board
        if (!this.isPlacementValid(coordinates)) {
            console.log('Ship placement is invalid.');
            return false;
        }

        //places ship on board
        coordinates.forEach(([x, y]) => {
            this.board[x][y] = ship;
        })
        return true;
    }

    //random direction generator for randomize ship placement button
    getRandomDirection() {
        return Math.random() < 0.5 ? 'horizontal' : 'vertical';
    }

    //function to generate random coordinate on board
    generateRandomCoordinate() {
        let min = Math.ceil(0);
        let max = Math.floor(9);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    //function for randomly placing ships on the board
    randomizeShipPlacements() {
        //iterate through the ship lengths provided in the config, and create a new ship for each 
        const ships = CONFIG.SHIP_LENGTHS.map((length) => {
            return new Ship(length);
        });

        //for each ship generated above we will..
        for(const ship of ships) {
            //generate a random x and y coordinate and direction
            let x = this.generateRandomCoordinate();
            let y = this.generateRandomCoordinate();
            let direction = this.getRandomDirection();
            let tries = 0;

            //we will then try to place this ship on the board over and over until a valid placement is found
            while(!this.placeShip(ship, x, y, direction) && tries < CONFIG.MAX_ATTEMPTS) {
                x = this.generateRandomCoordinate();
                y = this.generateRandomCoordinate();
                direction = this.getRandomDirection();
                tries++;
            }

            //loop exit if something terrible happens
            if(tries >= CONFIG.MAX_ATTEMPTS) {
                console.log('Computer failed to find a valid placement after maximum attempts.')
                return false;
            }    
        }
        return true;
    }

    //function to check if coordinates are within the bounds of the board
    isPlacementValid(coordinates) {
        for(let [x, y] of coordinates) {
            if(x < 0 || x > this.width - 1 || y < 0 || y > this.width - 1 || this.board[x][y] !== 0) {
                return false;
            }
        }
        return true;
    }

}

//function to handle all player activities. takes a name and board in the constructor
class Player {
    constructor(name, board) {
        this.board = board;
        this.name = name;
    }

    //function to attack the player's opponent's board
    attack(x, y, opponentBoard) {
        return opponentBoard.receiveAttack(x,y);
    }

    //function to generate a random coordinate. used for computer attacking
    generateRandomCoordinate() {
        let min = Math.ceil(0);
        let max = Math.floor(9);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    //function for computer attacking
    computerAttack(playerBoard) {
        let attacks = 0;

    //loop to search for random coordinates to attack within the bounds of the board, that havent been attacked already
        while (attacks < CONFIG.MAX_ATTEMPTS) {
            let randomX = this.generateRandomCoordinate();
            let randomY = this.generateRandomCoordinate();
    
            const attackResult = this.attack(randomX, randomY, playerBoard);
    
            if (attackResult !== false) {
                return attackResult;
            }
    
            attacks++;
        }
        //loop exit in case something terrible happens
        if(attacks >= CONFIG.MAX_ATTEMPTS) {
            console.log('Computer failed to find a valid target after 300 attempts.')
            return false;
        }
    }
}

export { Ship, Gameboard, Player }