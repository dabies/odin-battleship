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

}

export { Ship }