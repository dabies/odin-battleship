function createBoard(div) {
    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 10; j++) {
            const tile = document.createElement('div');
            tile.classList.add('blankTile');
            div.appendChild(tile);
        }
    }
}

function assignClassesBoard(tile) {
    if(tile === 'hit') {
        tile.classList.add('hitTile');
    } else if (tile === 'miss') {
        tile.classList.add('seaTile');
    } else {
        tile.classList.add('blankTile');
    }
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
        console.log('Must fill out player name.');
        return
    }

    const playerDiv = document.querySelector('.playerContent');
    const computerDiv = document.querySelector('.computerContent');

    const playerHeader = document.createElement('h2');
    playerHeader.classList.add('playerHeader');
    const computerHeader = document.createElement('h2');

    playerHeader.textContent = `${playerName}'s Board`;
    computerHeader.textContent = "Computer's Board";

    playerDiv.prepend(playerHeader);
    computerDiv.prepend(computerHeader);
    clearInput();
}

export { createBoard, assignClassesBoard, labelBoards }