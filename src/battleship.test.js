import { Gameboard, Ship } from './battleship'

it('works', () => {
    
});

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

const board = new Gameboard(10);

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
    expect(board.receiveAttack(2, 4)).toBe(true);
    expect(board.receiveAttack(2, 4)).toBe(false);
})