import { Ship, Gameboard, Player } from './battleship';


function createBoard(div) {
    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 10; j++) {
            const tile = document.createElement('div');
            tile.classList.add('blankTile');
            tile.setAttribute('data-x', i);
            tile.setAttribute('data-y', j);
            div.appendChild(tile);
        }
    }
}

function assignClassesBoard(tile, tileType) {
    if (tileType === 'ship') {
        tile.classList.add('ship');
    } else if (tileType === 'hit') {
        tile.classList.add('hitShip');
    } else if (tileType === 'miss') {
        tile.classList.add('seaTile');
    } else {
        tile.classList.add('blankTile');
    }
}

// Function to update player board display after ship placements
function updatePlayerBoardDisplay(board, boardDiv) {
    const tiles = boardDiv.querySelectorAll('.blankTile');

    tiles.forEach((tile) => {
        const x = parseInt(tile.getAttribute('data-x'));
        const y = parseInt(tile.getAttribute('data-y'));

        // Check if there's a ship at this position
        const tileContent = board.board[x][y];

        if (tileContent instanceof Ship) {
            assignClassesBoard(tile, 'ship');
        } else if (tileContent === 'hit') {
            assignClassesBoard(tile, 'hit');
        } else if (tileContent === 'miss') {
            assignClassesBoard(tile, 'miss');
        } else {
            assignClassesBoard(tile, 'blank');
        }
    });
}

function clearBoard(board, boardDiv) {
    const tiles = boardDiv.querySelectorAll('.blankTile');

    tiles.forEach((tile) => {
        const x = parseInt(tile.getAttribute('data-x'));
        const y = parseInt(tile.getAttribute('data-y'));

        tile.classList.remove('ship');
        tile.classList.remove('hitShip');
        tile.classList.remove('seaTile');
        tile.classList = 'blankTile'

        board.board[x][y] = 0;
    });
}

function clearInput() {
    const $playerNameInput = document.getElementById('playerName');
    $playerNameInput.value = '';
}

function labelBoards(playerName) {
    if(document.querySelector('.playerHeader')) {
        let change = document.querySelector('.playerHeader');
        change.textContent = `${playerName}'s Board`;
        clearInput();
        return
    } else if (playerName === '') {
        alert('Must fill out player name.');
        return;
    }

    const playerDiv = document.querySelector('.leftHalf');
    const computerDiv = document.querySelector('.rightHalf');

    const playerHeader = document.createElement('h2');
    playerHeader.classList.add('playerHeader');
    const computerHeader = document.createElement('h2');

    playerHeader.textContent = `${playerName}'s Board`;
    computerHeader.textContent = "Computer's Board";

    playerDiv.prepend(playerHeader);
    computerDiv.prepend(computerHeader);
    clearInput();
}

export { createBoard, updatePlayerBoardDisplay, labelBoards, clearBoard }