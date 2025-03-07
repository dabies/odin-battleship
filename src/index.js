import { Ship, Gameboard, Player } from './battleship';
import { 
    createBoard, 
    updatePlayerBoardDisplay, 
    labelBoards, 
    clearBoard, 
    playGame,
    clearElement,
    createBulletin,
    displayOnBulletin } from './DOM';
import './styles.css';

//cache DOM
const $inputDiv = document.querySelector('.input');
const $playerDiv = document.querySelector('.playerBoard');
const $computerDiv = document.querySelector('.computerBoard');
const $playerNameInput = document.getElementById('playerName');
const $playerNameSubmit = document.getElementById('nameSubmit');
const $randomizeButton = document.getElementById('shipPlacementButton');
const $playButton = document.getElementById('playButton');

let playerOneBoard = new Gameboard()
const playerOne = new Player('player', playerOneBoard);
let playerBoardDisplay = createBoard($playerDiv);

let computerBoard = new Gameboard();
const computerPlayer = new Player('Computer', computerBoard);
let computerBoardDisplay = createBoard($computerDiv);

//extra validation
let shipsPlaced = false;

//assign event listeners
$playerNameSubmit.addEventListener('click', () => {
    let name = $playerNameInput.value;
    if(name) {
       labelBoards(name);
       playerOne.name = name;
       clearElement($inputDiv);
       createBulletin($inputDiv);
       displayOnBulletin('Click the button to place your ships, then press play!');
    } else {
        alert('Please enter a player name!');
    }
})

$randomizeButton.addEventListener('click', () => {
    clearBoard(playerOne.board, $playerDiv);
    clearBoard(computerPlayer.board, $computerDiv);
    playerOne.board.randomizeShipPlacements();
    computerPlayer.board.randomizeShipPlacements();

    updatePlayerBoardDisplay(playerOne.board, $playerDiv);
    updatePlayerBoardDisplay(computerPlayer.board, $computerDiv);
    shipsPlaced = true;
    displayOnBulletin('Your ships have been placed, press the play button to start the game!');
})

$playButton.addEventListener('click', () => {
    if (shipsPlaced === false) {
        displayOnBulletin('Must place ships before playing!');
    } else {
        playGame(playerOne, playerOne.board, $playerDiv, computerPlayer, computerPlayer.board, $computerDiv);
        displayOnBulletin("Click a square on the computer's board to attack!");
        $playButton.disabled = true;
        $randomizeButton.disabled = true;
        shipsPlaced = false;
    }
})

export { playerOne, computerPlayer, shipsPlaced }
