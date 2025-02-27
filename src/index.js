import { Ship, Gameboard, Player } from './battleship';
import { createBoard, updatePlayerBoardDisplay, labelBoards, clearBoard } from './DOM';
import './styles.css';

//cache DOM
const $playerDiv = document.querySelector('.playerBoard');
const $computerDiv = document.querySelector('.computerBoard');
const $playerNameInput = document.getElementById('playerName');
const $playerNameSubmit = document.getElementById('nameSubmit');
const $randomizeButton = document.getElementById('shipPlacementButton');
const $playButton = document.getElementById('playButton');

const playerOneBoard = new Gameboard()
const playerOne = new Player(playerOneBoard);
const playerBoardDisplay = createBoard($playerDiv);

const computerBoard = new Gameboard();
const computerPlayer = new Player(computerBoard);
const computerBoardDisplay = createBoard($computerDiv);

//assign event listeners
$playerNameSubmit.addEventListener('click', () => {
    let name = $playerNameInput.value;
    if(name) {
       labelBoards(name); 
    } else {
        alert('Please enter a player name!');
    }
    
})

$randomizeButton.addEventListener('click', () => {
    clearBoard(playerOneBoard, $playerDiv);
    clearBoard(computerBoard, $computerDiv);
    playerOneBoard.randomizeShipPlacements();
    computerBoard.randomizeShipPlacements();

    updatePlayerBoardDisplay(playerOneBoard, $playerDiv);
    updatePlayerBoardDisplay(computerBoard, $computerDiv);
})

