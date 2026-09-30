const gameboard = (() => {
    let board = [];
    let boardDom = document.querySelector(".gameboard");
    let markedFieldsCount = 0;

    // Create a 3x3 board stored in 2d array with 1-9 numbers as placeholders.
    const newBoard = () => {
        let placeholder = 1;
        for (let i = 0; i < 3; i++) {
            board[i] = [];
            for (let j = 0; j < 3; j++) {
                board[i].push(placeholder);
                placeholder += 1;
            }
        }
    }

    function stopRound() {
        markedFieldsCount = 0;
        gameData.clearAnnText();
        newBoard();
        screen.updateBoard();
        screen.deactivateReset();

    }

    function markCell(index1, index2, mark) {
        board[index1][index2] = mark;
        markedFieldsCount++;
        checkForWin();
    }

    function checkForWin() {
        let arr = [];

        // Push to array horizontal & vertical combinations
        for (let i = 3 - 1; i >= 0; i--) {
            arr.push([], []);
            for (let y = 3 - 1; y >= 0; y--) {
                arr[arr.length - 1].push(board[i][y]);
                arr[arr.length - 2].push(board[y][i]);
            }
        }
        // Push to array diagonall combinations
        arr.push([board[0][0], board[1][1], board[2][2]]);
        arr.push([board[2][0], board[1][1], board[0][2]]);

        // Check if there are any winning combinations
        for (row of arr) {
            if (row[0] === row[1] && row[0] === row[2]) {
                let mark = row[0];
                gameData.increaseScore(mark);
                screen.activateReset();
                console.log(`${mark} won!`)
                return;
            } 
            if (markedFieldsCount === 9) {
                gameData.increaseScore();
                screen.activateReset();
                console.log("It's a TIE!")
                return;
                }
    
        } 
    }

    newBoard();
    return { board, newBoard, markCell, checkForWin, stopRound };
})();


const gameData = (() => {
    let currentPlayer = 1;
    let startingPlayer = 1;
    let player1Score = 0;
    let tieCount = 0;
    let player2Score = 0;
    let markedFieldsCount = 0;


    const firstScore = document.querySelector(".player1-score");
    const tieDisplay = document.querySelector(".tie-count");
    const secondScore = document.querySelector(".player2-score");
    const roundResult = document.querySelector(".winner-announcement");

    function displayScore() {
        firstScore.textContent = player1Score;
        tieDisplay.textContent = tieCount;
        secondScore.textContent = player2Score;
    }


    function increaseScore(mark = null) {
        if (mark === "X") {
            player1Score++;
            roundResult.textContent = "Player 1 (X) Won!";
        } else if (mark === "O") {
            player2Score++;
            roundResult.textContent = "Player 2 (O) won!";
        } else {
            tieCount++;
            roundResult.textContent = "It's a tie!";
        }
        displayScore();
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function switchPlayer() {
        currentPlayer = Math.abs(currentPlayer - 3);
    }

    function clearAnnText() {
        roundResult.textContent = ""
    }

    function resetGame() {
        currentPlayer = 1;
        player1Score = 0;
        tieCount = 0;
        player2Score = 0;
        gameboard.newBoard();
    }

    displayScore();

    return {getCurrentPlayer, displayScore, increaseScore, switchPlayer, 
        resetGame, clearAnnText}
})()

function connectScreen() {
    const allCells = document.querySelectorAll(".gameboard .cell");
    const boardArray = gameboard.board;


    function updateBoard() {
        cellIndex = 0
        for (let firstIndex=0; firstIndex < 3; firstIndex++) {
            for (let secondIndex=0; secondIndex < 3; secondIndex++) {
                const currentCell = allCells[cellIndex];
                cellIndex++;
                currentCell.textContent = boardArray[firstIndex][secondIndex];
                currentCell.setAttribute("data-index-1", firstIndex);
                currentCell.setAttribute("data-index-2", secondIndex);
                }
            }
        }

    function setControls() {
        for (cell of allCells) {
            const index1 = cell.attributes["data-index-1"].value;
            const index2 = cell.attributes["data-index-2"].value;
            cell.addEventListener("click", (e) => {
                // Check if cell is already marked 
                if (isNaN(e.srcElement.textContent)) {
                    return;
                } else {
                    const mark = gameData.getCurrentPlayer() == 1 ? "X" : "O";
                    gameboard.markCell(index1, index2, mark);
                    updateBoard();
                    gameData.switchPlayer();
                }
            })
        }
    }

    const resetOverlay = document.querySelector(".restart");
    resetOverlay.addEventListener("click", gameboard.stopRound);

    function activateReset() {
        resetOverlay.style.display = "block";
        console.log("reset activated");
    }

    function deactivateReset() {
        resetOverlay.style.display = "none";
        console.log("reset deactivated");
    }



    updateBoard();
    setControls();

    return { updateBoard, activateReset, deactivateReset }

}

const screen = connectScreen();

