import { Gameboard, Ship, Player } from './battleship'

it('works', () => {
    
});

//testing isSunk functionality
it('Returns if a ship is living', () => {
    const livingShip = new Ship(1);
    expect(livingShip.isSunk).toBe(false);
});

it('Knows if a ship has sunk after being hit', () => {
    const deadShip = new Ship(2);
    deadShip.hit();
    deadShip.hit();
    expect(deadShip.isSunk).toBe(true);
})

//testing receiveAttack functionality
const board = new Gameboard();

it('Rejects out of bounds move', () => {
    expect(board.receiveAttack(-1, 5)).toBe(false);
    expect(board.receiveAttack(-1, 10)).toBe(false);
    expect(board.receiveAttack(5, -5)).toBe(false);
    expect(board.receiveAttack(1, 11)).toBe(false);
})

board.receiveAttack(3,9);

it('Rejects move on coordinate that is already hit', () => {
    expect(board.receiveAttack(3, 9)).toBe(false);
})

it('Allows one hit on coordinate before rejecting second hit', () => {
    expect(board.receiveAttack(2, 4)).toBe('miss');
    expect(board.receiveAttack(2, 4)).toBe(false);
})

//testing place ship functionality
const newBoard = new Gameboard();
const unluckyShip = new Ship(3);
newBoard.placeShip(unluckyShip, 1, 6, 'vertical'); // Place the ship vertically


it('Places ship and registers if it is sunk', () => {
    // Before attacks, ship is not sunk
    expect(unluckyShip.isSunk).toBe(false);
    
    // Attack the ship at the coordinates where it's placed
    const attackResult1 = newBoard.receiveAttack(1, 6); // Hit at (1, 6)
    const attackResult2 = newBoard.receiveAttack(1, 7); // Hit at (1, 7)
    const attackResult3 = newBoard.receiveAttack(1, 8); // Hit at (1, 8)
    
    // After attacks, is ship sunk?
    expect(unluckyShip.isSunk).toBe(true);

    //check the return values of the receiveAttack method
    expect(attackResult1).toBe('hit');
    expect(attackResult2).toBe('hit');
    expect(attackResult3).toBe('sunk');
});

//testing Player class functionality
const playerOneBoard = new Gameboard();
const playerOne = new Player('player', playerOneBoard)
const computerBoard = new Gameboard();
const computerPlayer = new Player('computer', computerBoard);
computerPlayer.board.placeShip(1, 6, 'horizontal');

it('Can attack opponents', () => {
    const firstAttack = playerOne.attack(1, 6, computerPlayer.board);
    expect(firstAttack).toBe('miss');
})

it('Still does not allow you to attack same square twice', () => {
    const secondAttack = playerOne.attack(1, 6, computerPlayer.board);
    expect(secondAttack).toBe(false);
})

it('Handles computer attacks', () => {
    const computerAttack = computerPlayer.computerAttack(playerOneBoard);
    expect(computerAttack).toBe('miss');
})