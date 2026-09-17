function createPlayer() {
    let score = 0;
    const getScore = () => score;
    const addScore = () => score++;
    const resetScore = () => score = 0;

    return { getScore, addScore, resetScore };
}

const gameboard = (() => {

    board = [];
    const newBoard = (rows=3, columns=3) => {
        let placeholder = 1
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(placeholder);
                placeholder += 1;
            }
        }
        console.log(board);
    }

    newBoard();

    const markCell = (coords, mark) => {
        board[coords[0]][coords[1]] = mark;
        console.log(board);
    }

    const checkForWin = () => {
        /// Array to store all possible winning combinations
        let arr = [];

        // Store all horizontal & vertical combinations
        for (let i = 3 - 1; i >= 0; i--) {
            arr.push([], []);
            for (let y = 3 - 1; y >= 0; y--) {
                arr[arr.length - 1].push(board[i][y]);
                arr[arr.length - 2].push(board[y][i]);
            }
        }
        // Store diagonall combinations
        arr.push([board[0][0], board[1][1], board[2][2]]);
        arr.push([board[2][0], board[1][1], board[0][2]]);

        // Check if there are any winning combinations
        for (row of arr) {
            if (row[0] === row[1] && row[0] === row[2]) {
                console.log(`won ${row[0]}`);
                console.log(row[0], row[1], row[2]);
                return row[0];
            }
        }
    }

    return { board, newBoard, markCell, checkForWin };
})();


