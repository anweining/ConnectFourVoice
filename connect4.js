var playerRed = "R";
var playerYellow = "Y";
var currPlayer = playerRed;

var gameOver = false;
var board;

var rows = 6;
var columns = 7;
var currColumns = []; //keeps track of which row each column is at.

window.onload = function() {
  setGame();

  const tiles = new Map();
  tiles.set("canada", "0-0");
  tiles.set("usa", "0-1");
  tiles.set("mexico", "0-2");
  tiles.set("japan", "0-3");
  tiles.set("china", "0-4");
  tiles.set("india", "0-5");
  tiles.set("russia", "0-6");

  var speechRecognition = window.webkitSpeechRecognition;

  var recognition = new speechRecognition();

  var content = "";

  recognition.continuous = true;

  recognition.start();

  // recognition i9s started

  recognition.onstart = function () {
    //instructions.text("Voice Recognition is on");
    console.log("First");
  }

  recognition.onspeechend = function () {
    console.log("Third");
    //instructions.text("No Activity");
    //recognition.start();
  }

  recognition.onend = function () {
    console.log("Fourth");
    //if (gameOver != true) {
    recognition.start();
    //}
  }

  recognition.onerror = function () {
    //instructions.text("Try Again");
  }

  recognition.onresult = function (event) {
    console.log("Second");
    var current = event.resultIndex;

    var transcript = event.results[current][0].transcript;

    content = transcript.toLowerCase();
    let lastChar = content[content.length-1]
    console.log(content);
    if ((content.length > 2) && ('.' == lastChar)) {
        content = content.substring(0, content.length-1);
    }
    if ((content.length > 2) && (' ' == content.charAt(0))) {
        content = content.substring(1, content.length);
    }
    /*
    if (event.resultIndex == 0) {
      content = transcript.toLowerCase();
    }

    else {
      content = transcript.toLowerCase().slice(0);
    }
    */

    //content = transcript.toLowerCase();
    console.log(content);

    if (tiles.has(content)) {
      setPiece(tiles.get(content));
    }

    //textbox.val(content);
  }

  //recognition.start();
  recognition.stop();
}

function setGame() {
  board = [];
  currColumns = [5, 5, 5, 5, 5, 5, 5];

  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      // JS
      row.push(' ');
      // HTML
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.classList.add("tile");
      //tile.addEventListener("click", setPiece);
      document.getElementById("board").append(tile);
    }
    board.push(row);
  }
}

function setPiece(content) {
    if (gameOver) {
        return;
    }

    //get coords of that tile clicked
    let coords = content.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    // figure out which row the current column should be on
    r = currColumns[c]; 

    if (r < 0) { // board[r][c] != ' '
        return;
    }

    board[r][c] = currPlayer; //update JS board
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currPlayer == playerRed) {
        tile.classList.add("red-piece");
        currPlayer = playerYellow;
    }
    else {
        tile.classList.add("yellow-piece");
        currPlayer = playerRed;
    }

    r -= 1; //update the row height for that column
    currColumns[c] = r; //update the array

    checkWinner();
}

function checkWinner() {
     // horizontal
     for (let r = 0; r < rows; r++) {
         for (let c = 0; c < columns - 3; c++){
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
         }
    }

    // vertical
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // anti diagonal
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // diagonal
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
}

function setWinner(r, c) {
    let winner = document.getElementById("winner");
    if (board[r][c] == playerRed) {
        winner.innerText = "Red Wins";             
    } else {
        winner.innerText = "Yellow Wins";
    }
    gameOver = true;
}
