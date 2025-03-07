import { Ship, Gameboard, Player } from './battleship';
import { playerOne, computerPlayer, shipsPlaced } from './index';

//cache DOM
const $inputDiv = document.querySelector('.input');
const $playerDiv = document.querySelector('.playerBoard');
const $computerDiv = document.querySelector('.computerBoard');
const $playerNameInput = document.getElementById('playerName');
const $playerNameSubmit = document.getElementById('nameSubmit');
const $randomizeButton = document.getElementById('shipPlacementButton');
const $playButton = document.getElementById('playButton');

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
        tile.textContent = 'X';
    } else if (tileType === 'miss') {
        tile.classList.add('seaTile');
        tile.textContent = 'X';
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
    updatePlayerBoardDisplay(board, boardDiv);
}

function clearInput() {
    $playerNameInput.value = '';
}

function labelBoards(playerName) {
    try {
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
    } catch (error) {
        alert('Please enter and submit a name before continuing :)')
    }
}

function gameOver(playerOne, playerOneBoard, playerTwo, playerTwoBoard) {
    if(playerOneBoard.sunkenShips >= 5) {
        displayOnBulletin(`${playerTwo.name} has won the game! Click the restart button below if you'd like to play again.`);
        $playButton.textContent = 'Restart?';
        $playButton.disabled = false;
        $playButton.removeEventListener('click', handlePlayClick);
        $playButton.addEventListener('click', handleRestartClick);
        return true;
    } else if (playerTwoBoard.sunkenShips >= 5) {
        displayOnBulletin(`${playerOne.name} has won the game! Click the restart button below if you'd like to play again.`);
        $playButton.textContent = 'Restart?'
        $playButton.disabled = false;
        $playButton.removeEventListener('click', handlePlayClick);
        $playButton.addEventListener('click', handleRestartClick);
        return true;
    } else {
        return false;
    }
}

function playerAttack(event, player, computerBoard, computerDiv) {
    let attackedDiv = event.target;
    const x = parseInt(attackedDiv.getAttribute('data-x'));
    const y = parseInt(attackedDiv.getAttribute('data-y'));

    if (computerBoard.board[x][y] === 'miss' || computerBoard.board[x][y] === 'hit') {
        displayOnBulletin('You already attacked that tile!');
        return;
    }
    
    const result = player.attack(x, y, computerBoard);  // Player attacks the computer's board
    if(result === 'sunk') {
        displayOnBulletin(`You've sunk a ship!`);
    } else if (result === 'hit') {
        displayOnBulletin("You've hit a ship!")
    } else if(result === "miss") {
        displayOnBulletin("You missed.")
    }
    updatePlayerBoardDisplay(computerBoard, computerDiv); // Update display after attack
    return true;
}

function computerTurn(playerOneBoard, computer, playerDiv) {
    setTimeout(() => {
        const compAttack = computer.computerAttack(playerOneBoard);
        if(compAttack === 'sunk') {
            displayOnBulletin('The computer has sunk a ship!')
        } else if (compAttack === 'hit') {
            displayOnBulletin("The computer hit a ship!")
        } else if(compAttack === "miss") {
            displayOnBulletin("The computer missed.")
        }
        updatePlayerBoardDisplay(playerOneBoard, playerDiv);
        return true;
    }, 1000);
}

function playGame(player, playerBoard, playerDiv, computer, computerBoard, computerDiv) {
    // Only add the event listener if it's not already attached
    if (!computerDiv.classList.contains('gameStarted')) {
        computerDiv.classList.add('gameStarted');
        computerDiv.addEventListener('click', handleAttack);
    }

    function handleAttack(event) {
        try {
            const attack = playerAttack(event, player, computerBoard, computerDiv);
            if (gameOver(player, playerBoard, computer, computerBoard)) {
                disableBoard(computerDiv);
                disableBoard(playerDiv);
                computerDiv.removeEventListener('click', handleAttack); // Remove the event listener after the game is over
                return;
            } else if (attack) {
                computerTurn(playerBoard, computer, playerDiv);
            }
        } catch (error) {
            displayOnBulletin('Oops. Looks like you accidentally highlighted some squares before attacking. Try again!')
        }
        
    }
}

function clearElement(element) {
    element.innerHTML = '';
}

function createBulletin(parent) {
    let div = document.createElement('div');
    div.classList.add('bulletin');
    parent.appendChild(div);
}

function displayOnBulletin(string) {
    try {
        let bulletin = document.querySelector('.bulletin');
        bulletin.textContent = string;
    } catch (error) {
        alert('Please enter and submit a name before continuing :)')
    }
    
}

function disableBoard(div) {
    div.classList.add('disabled');
}

function enableBoard(div) {
    div.classList.remove('disabled');
}

function removeBoards() {
    $playerDiv.innerHTML = '';
    $computerDiv.innerHTML = '';
}

function restartGame(playerDiv, computerDiv) {
    playerOne.board.resetBoard();
    computerPlayer.board.resetBoard();

    removeBoards();
    
    createBoard(playerDiv);
    createBoard(computerDiv);

    computerPlayer.board.randomizeShipPlacements();
    playerOne.board.randomizeShipPlacements();

    
    displayOnBulletin('Click the button to continute to randomize your ship placements, or press play to start a new game!');
    updatePlayerBoardDisplay(playerOne.board, playerDiv);
    updatePlayerBoardDisplay(computerPlayer.board, computerDiv);
    enableBoard(playerDiv);
    enableBoard(computerDiv);

    $randomizeButton.disabled = false;
    $playButton.textContent = 'Play Game!';
    $playButton.disabled = false;

    computerDiv.classList.remove('gameStarted');
    
    $playButton.removeEventListener('click', handleRestartClick);
    $playButton.addEventListener('click', handlePlayClick);
}

function handleRestartClick() {
    restartGame($playerDiv, $computerDiv);
}

function handlePlayClick() {
    // Disable play and randomize buttons to prevent multiple clicks
    $playButton.disabled = true;
    $randomizeButton.disabled = true;

    // Call playGame to start the game, and update bulletin
    playGame(playerOne, playerOne.board, $playerDiv, computerPlayer, computerPlayer.board, $computerDiv);
    displayOnBulletin("Click a square on the computer's board to attack!");
}

export { createBoard, 
        updatePlayerBoardDisplay, 
        labelBoards, 
        clearBoard, 
        playGame, 
        clearElement, 
        createBulletin,
        displayOnBulletin }