import { Ship, Gameboard, Player } from './battleship';
import { createBoard, assignClassesBoard, labelBoards } from './DOM';
import './styles.css';

//cache DOM
const $playerDiv = document.querySelector('.playerBoard');
const $computerDiv = document.querySelector('.computerBoard');
const $playerNameInput = document.getElementById('playerName');
const $playerNameSubmit = document.getElementById('nameSubmit');

//assign event listeners
$playerNameSubmit.addEventListener('click', () => {
    let name = $playerNameInput.value;
    labelBoards(name);
})
const playerOneBoard = new Gameboard()
const playerOne = new Player(playerOneBoard);
const playerBoardDisplay = createBoard($playerDiv);

const computerBoard = new Gameboard();
const computerPlayer = new Player(computerBoard);
const computerBoardDisplay = createBoard($computerDiv);



