const highScoreP = document.getElementById("highScore");
let highScore = localStorage.getItem("highScore");
if (highScore !== null) {
  highScore = parseInt(highScore);
  highScoreP.textContent = "High score: " + highScore;
}

function GenerateNewShape() {
  newShape = {
    shapeType: SHAPE_TYPE[Math.floor(Math.random() * SHAPE_TYPE.length)],
    top: 0,
    left: BoardSize.cols / 2 - 1,
    shapeOrient: 0,
  };
  newShape.squareArr = getShape(
    newShape.shapeType,
    newShape.top,
    newShape.left,
    newShape.shapeOrient
  );
  return newShape;
}

function DrawFallingShape() {
  curShape.squareArr.forEach((square) => {
    fillSquare(square);
  });
}

function Init_occupied_squares() {
  retval = [];
  for (i = 0; i < BoardSize.rows; i++) {
    boardRow = Array(BoardSize.cols).fill(false);
    retval.push(boardRow);
  }
  return retval;
}

function DrawFrame() {
  clearBoard();
  drawBoard();
  drawGrid();
  DrawFallingShape();
  drawOccpiedSquares();
}
function IsSquareOccupied(square) {
  if (
    square.row >= BoardSize.rows ||
    square.col < 0 ||
    square.col >= BoardSize.cols
  ) {
    return true;
  }
  if (square.row < 0) {
    return false;
  }
  return occupiedSquares[square.row][square.col];
}

function isShapeOccupied(shape) {
  return shape.some((square) => IsSquareOccupied(square));
}

function AddFallingShapeToOccupiedSquares() {
  curShape.squareArr.forEach((shapeSquare) => {
    if (shapeSquare.row < 0) {
      clearInterval(intervalId);
      /*קטע קוד של שמע*/
      const audio1 = document.getElementById("audioTetrisOver");
      const audio = document.getElementById("audioTetris");
      const baseCanvas = document.getElementById("baseCanvas");
      const newGame = document.getElementById("newGame");
      newGame.style.display = "block";
      baseCanvas.style.display = "none";
      faster.style.display = "none";
      // בדיקה אם האלמנט נמצא
      if (audio1) {
        audio1.play();
        audio.pause();
      } else {
        console.error("אלמנט השמע לא נמצא");
      }

      return;
    } else {
      occupiedSquares[shapeSquare.row][shapeSquare.col] = true;
    }
  });
}
function RemoveFullLines() {
  fullLines = [];
  for (let i = 0; i < occupiedSquares.length; i++) {
    if (occupiedSquares[i].every((square) => square)) {
      fullLines.push(i);
    }
  }
  while (fullLines.length > 0) {
    for (let i = fullLines[0]; i > 0; i--) {
      occupiedSquares[i] = occupiedSquares[i - 1];
    }
    occupiedSquares[0] = Array(BoardSize.cols).fill(false);
    fullLines.shift();
    const audioTetrisPlus = document.getElementById("audioTetrisPlus");
    audioTetrisPlus.play();
    score++;
    if (score > highScore) {
      localStorage.setItem("highScore", score);
      highScoreP.textContent = "High score:  " + score;
    }
  }
}

function drawOccpiedSquares() {
  for (i = 0; i < occupiedSquares.length; i++) {
    for (j = 0; j < occupiedSquares[i].length; j++) {
      if (occupiedSquares[i][j]) {
        fillSquare({ row: i, col: j });
      }
    }
  }
}

function MainLoop() {
  DrawFrame();
  movedDownShape = getShape(
    curShape.shapeType,
    curShape.top + 1,
    curShape.left,
    curShape.shapeOrient
  );
  if (isShapeOccupied(movedDownShape)) {
    AddFallingShapeToOccupiedSquares();
    curShape = GenerateNewShape();
    RemoveFullLines();
  } else {
    curShape.squareArr = movedDownShape;
    curShape.top++;
  }
}

function fasterFunction() {
  const faster = document.getElementById("faster");
  clearInterval(intervalId);
  intervalId = setInterval(MainLoop, 100);
  faster.style.display = "none";
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      e.preventDefault();
      movedLeftShape = getShape(
        curShape.shapeType,
        curShape.top,
        curShape.left - 1,
        curShape.shapeOrient
      );
      if (!isShapeOccupied(movedLeftShape)) {
        curShape.squareArr = movedLeftShape;
        curShape.left--;
      }
      break;
    case "ArrowRight":
      e.preventDefault();
      movedtRightShape = getShape(
        curShape.shapeType,
        curShape.top,
        curShape.left + 1,
        curShape.shapeOrient
      );
      if (!isShapeOccupied(movedtRightShape)) {
        curShape.squareArr = movedtRightShape;
        curShape.left++;
      }
      break;
    case "ArrowUp":
      e.preventDefault();
      rotatedShape = getShape(
        curShape.shapeType,
        curShape.top,
        curShape.left,
        (curShape.shapeOrient + 1) % 4
      );
      if (!isShapeOccupied(rotatedShape)) {
        curShape.squareArr = rotatedShape;
        curShape.shapeOrient = (curShape.shapeOrient + 1) % 4;
      }
      break;
  }
});

//גודל הלוח
const BoardSize = { rows: 16, cols: 14 };

curShape = GenerateNewShape();
occupiedSquares = Init_occupied_squares();
intervalId = setInterval(MainLoop, 200);
let score = 0;
