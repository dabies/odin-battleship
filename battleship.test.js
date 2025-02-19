import { Ship } from './battleship'

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