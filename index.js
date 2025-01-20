
let selectedCell = null;


setupGame();
setupOptions();
setupRestart();



function setupGame() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        if (!cell.hasAttribute("data-fixed")) {
            cell.addEventListener("click", () => selectCell(cell));
        }
    });
}


function setupOptions() {
    const options = document.querySelectorAll("#options div:not(#cut):not(#restartGame)");
    options.forEach(option => {
        option.addEventListener("click", () => {
            if (selectedCell && !selectedCell.hasAttribute("data-fixed")) {
                selectedCell.textContent = option.textContent;
                validateSudoku();
            }
        });
    });

    const eraseButton = document.getElementById("cut");
    eraseButton.addEventListener("click", () => {
        if (selectedCell && !selectedCell.hasAttribute("data-fixed")) {
            selectedCell.textContent = ""; 
            validateSudoku();
        }
    });
}

function selectCell(cell) {
    if (selectedCell) {
        selectedCell.classList.remove("selected");
        selectedCell.style.backgroundColor = '';
    }
    selectedCell = cell;
    selectedCell.classList.add("selected");
    selectedCell.style.backgroundColor = 'rgba(78, 40, 2, 0.14)';
}

function setupRestart() {
    const restartButton = document.getElementById("restartGame");
    restartButton.addEventListener("click", () => {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            if (!cell.hasAttribute("data-fixed")) {
                cell.textContent = ""; 
            }
            cell.classList.remove("error");
        });
        selectedCell = null;
    });
}

function validateSudoku() {
    clearErrors();
    if (validateRows() && validateColumns() && validateBoxes()) {
        checkWin();
    }
}

function clearErrors() {
    document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("error"));
}

function validateRows() {
    for (let row = 0; row < 9; row++) {
        const seen = new Set();
        for (let col = 0; col < 9; col++) {
            const cell = document.getElementById(`cell${row * 9 + col + 1}`);
            const value = cell.textContent.trim();
            if (value && seen.has(value)) {
                highlightError(row, col);
                return false;
            }
            seen.add(value);
        }
    }
    return true;
}

function validateColumns() {
    for (let col = 0; col < 9; col++) {
        const seen = new Set();
        for (let row = 0; row < 9; row++) {
            const cell = document.getElementById(`cell${row * 9 + col + 1}`);
            const value = cell.textContent.trim();
            if (value && seen.has(value)) {
                highlightError(row, col);
                return false;
            }
            seen.add(value);
        }
    }
    return true;
}

function validateBoxes() {
    const boxStarts = [0, 3, 6, 27, 30, 33, 54, 57, 60];
    for (let start of boxStarts) {
        const seen = new Set();
        for (let i = 0; i < 9; i++) {
            const row = Math.floor(start / 9) + Math.floor(i / 3);
            const col = (start % 9) + (i % 3);
            const cell = document.getElementById(`cell${row * 9 + col + 1}`);
            const value = cell.textContent.trim();
            if (value && seen.has(value)) {
                highlightError(row, col);
                return false;
            }
            seen.add(value);
        }
    }
    return true;
}

function highlightError(row, col) {
    const cell = document.getElementById(`cell${row * 9 + col + 1}`);
    cell.classList.add("error");
}

function checkWin() {
    const cells = document.querySelectorAll(".cell");
    const allFilled = Array.from(cells).every(cell => cell.textContent.trim() !== "");
    const noErrors = Array.from(cells).every(cell => !cell.classList.contains("error"));

    if (allFilled && noErrors) {
        alert("Congratulations! You solved the Sudoku!");
    }
}
