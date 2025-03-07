import { Ship, Gameboard, Player } from './battleship';
import { playerOne, computerPlayer, shipsPlaced } from './index';

//cache DOM
const $playerDiv = document.querySelector('.playerBoard');
const $computerDiv = document.querySelector('.computerBoard');
const $playerNameInput = document.getElementById('playerName');
const $randomizeButton = document.getElementById('shipPlacementButton');
const $playButton = document.getElementById('playButton');

//function for creating the board in the DOM. assigns each div a data-x and data-y in order to better
//connect them with the gameboards
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

//function that adds classes to tiles based on their values, which will make them look how they should
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

    //iterates through the tiles, and gets their x and y values
    tiles.forEach((tile) => {
        const x = parseInt(tile.getAttribute('data-x'));
        const y = parseInt(tile.getAttribute('data-y'));

        // Check if there's a ship at this position
        const tileContent = board.board[x][y];

        //assigns classes to each tile based on their values
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

//function to clear board in the DOM
function clearBoard(board, boardDiv) {
    const tiles = boardDiv.querySelectorAll('.blankTile');

    //iterates through all tiles to get their x and y values
    tiles.forEach((tile) => {
        const x = parseInt(tile.getAttribute('data-x'));
        const y = parseInt(tile.getAttribute('data-y'));

        //removes any possible classes other than blank tile
        tile.classList.remove('ship');
        tile.classList.remove('hitShip');
        tile.classList.remove('seaTile');
        tile.classList = 'blankTile'

        //resets the value of each tile to zero in the game board
        board.board[x][y] = 0;
    });
    //updates the display after doing this
    updatePlayerBoardDisplay(board, boardDiv);
}

//clears the input after submitting name
function clearInput() {
    $playerNameInput.value = '';
}

//function to label boards after receiving the name input from the player
function labelBoards(playerName) {
    //try catch to catch any errors where the user tries to do something other than submitting a name
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

//function to check if game is over
function gameOver(playerOne, playerOneBoard, playerTwo, playerTwoBoard) {
    //if either play has 5 ships sunk, they have lost. this is reflected in the bulletin
    if(playerOneBoard.sunkenShips >= 5) {
        displayOnBulletin(`${playerTwo.name} has won the game! Click the restart button below if you'd like to play again.`);

        //after game is finished, we prepare for a potential restart by enabling a restart button
        $playButton.textContent = 'Restart?';
        $playButton.disabled = false;

        //as the button is now for restarting, we remove the playgame from it, and add the restart functionality to it
        $playButton.removeEventListener('click', handlePlayClick);
        $playButton.addEventListener('click', handleRestartClick);

        //return true if game is over
        return true;
        
        //we do the same for the other player
    } else if (playerTwoBoard.sunkenShips >= 5) {
        displayOnBulletin(`${playerOne.name} has won the game! Click the restart button below if you'd like to play again.`);
        $playButton.textContent = 'Restart?'
        $playButton.disabled = false;
        $playButton.removeEventListener('click', handlePlayClick);
        $playButton.addEventListener('click', handleRestartClick);
        return true;

        //return false because game isnt over if these conditions arent met
    } else {
        return false;
    }
}

//function for player attacking board in DOM
function playerAttack(event, player, computerBoard, computerDiv) {
    //we gather the coordinates of the attack by getting the x and y attribute from the div that was clicked on
    let attackedDiv = event.target;
    const x = parseInt(attackedDiv.getAttribute('data-x'));
    const y = parseInt(attackedDiv.getAttribute('data-y'));

    //if tile has already been attacked, we return
    if (computerBoard.board[x][y] === 'miss' || computerBoard.board[x][y] === 'hit') {
        displayOnBulletin('You already attacked that tile!');
        return;
    }
    
    // Player attacks the computer's board
    const result = player.attack(x, y, computerBoard);  
    if(result === 'sunk') {
        displayOnBulletin(`You've sunk a ship!`);
    } else if (result === 'hit') {
        displayOnBulletin("You've hit a ship!")
    } else if(result === "miss") {
        displayOnBulletin("You missed.")
    }
    // Update display after attack
    updatePlayerBoardDisplay(computerBoard, computerDiv); 
    return true;
}

//function for handling the computers turn in the DOM
function computerTurn(playerOneBoard, computer, playerDiv) {
    //we set a timeout so there is a slight delay after human makes their move to make computer seem more human
    setTimeout(() => {
        //computer attacks player board
        const compAttack = computer.computerAttack(playerOneBoard);
        if(compAttack === 'sunk') {
            displayOnBulletin('The computer has sunk a ship!')
        } else if (compAttack === 'hit') {
            displayOnBulletin("The computer hit a ship!")
        } else if(compAttack === "miss") {
            displayOnBulletin("The computer missed.")
        }
        //update display after attack has been made
        updatePlayerBoardDisplay(playerOneBoard, playerDiv);
        return true;
    }, 1000);
}

function playGame(player, playerBoard, playerDiv, computer, computerBoard, computerDiv) {
    // Only add the event listener if game hasnt been started already
    //this prevents event listener from being attached multiple times, which would make the program attack twice 
    //for every attack, and result in every attack being on an 'attacked' square
    if (!computerDiv.classList.contains('gameStarted')) {
        computerDiv.classList.add('gameStarted');
        computerDiv.addEventListener('click', handleAttack);
    }

    //function for attacking 
    function handleAttack(event) {
        //try catch added to handle common error where player accidentally highlighted squares while attacking
        try {
            //attack is made, and then a check is made to see if game is over
            const attack = playerAttack(event, player, computerBoard, computerDiv);
            if (gameOver(player, playerBoard, computer, computerBoard)) {
                //if game is over, we disable boards and the ability to attack
                disableBoard(computerDiv);
                disableBoard(playerDiv);
                 // Remove the event listener after the game is over
                computerDiv.removeEventListener('click', handleAttack);
                return;
            } else if (attack) {
                //if game isnt over, it is the computers turn
                computerTurn(playerBoard, computer, playerDiv);
            }
        } catch (error) {
            displayOnBulletin('Oops. Looks like you accidentally highlighted some squares before attacking. Try again!')
        }
        
    }
}

//function to clear an element, this is used for the input div when transforming it into the bulletin
function clearElement(element) {
    element.innerHTML = '';
}

//creates bulletin and appends it to parent div
function createBulletin(parent) {
    let div = document.createElement('div');
    div.classList.add('bulletin');
    parent.appendChild(div);
}

//function to display strings on the bulletin board
function displayOnBulletin(string) {
    try {
        let bulletin = document.querySelector('.bulletin');
        bulletin.textContent = string;
    } catch (error) {
        alert('Please enter and submit a name before continuing :)')
    }
}

//functions to disable and enable clicking on the DOM boards
function disableBoard(div) {
    div.classList.add('disabled');
}

function enableBoard(div) {
    div.classList.remove('disabled');
}

//function to remove boards from the DOM
function removeBoards() {
    $playerDiv.innerHTML = '';
    $computerDiv.innerHTML = '';
}

//function for restarting game after game has finished
function restartGame(playerDiv, computerDiv) {
    //reset each players boards in the gameboard class
    playerOne.board.resetBoard();
    computerPlayer.board.resetBoard();

    //remove boards from the DOM
    removeBoards();
    
    //create two new boards for the players
    createBoard(playerDiv);
    createBoard(computerDiv);

    //randomize ship placements to start new game (player can change if they'd like)
    computerPlayer.board.randomizeShipPlacements();
    playerOne.board.randomizeShipPlacements();

    //update bulletin, update boards, and enable boards for clicking 
    displayOnBulletin('Click the button to continute to randomize your ship placements, or press play to start a new game!');
    updatePlayerBoardDisplay(playerOne.board, playerDiv);
    updatePlayerBoardDisplay(computerPlayer.board, computerDiv);
    enableBoard(playerDiv);
    enableBoard(computerDiv);

    //enable buttons to be clicked, and change button back into the play game button
    $randomizeButton.disabled = false;
    $playButton.textContent = 'Play Game!';
    $playButton.disabled = false;

    //removes class to let our play game function know that there isnt currently a game being played
    computerDiv.classList.remove('gameStarted');
    
    //removes restart functionality and adds playing functionality
    $playButton.removeEventListener('click', handleRestartClick);
    $playButton.addEventListener('click', handlePlayClick);
}

//event listener callback function
function handleRestartClick() {
    restartGame($playerDiv, $computerDiv);
}

//event listener callback function
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