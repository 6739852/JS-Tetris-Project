/*פיקסלים של כל משבצת*/
squareSize = 30;
canvas = document.getElementById("baseCanvas");
ctx = canvas.getContext("2d");
// canvas.style.backgroundColor = "rgba(255,255, 255, 0.5)";
score = 0;

//פונקציה של ציור הלוח
function drawBoard() {
  ctx.beginPath();
  ctx.rect(0, 0, BoardSize.cols * squareSize, BoardSize.rows * squareSize);
  ctx.stroke();
  const paragraphs = document.querySelectorAll("#score");
  paragraphs[0].textContent = "score:  " + score;

  /*קטע קוד של שמע - לא עובד*/
  const audio = document.getElementById("audioTetris");
  // בדיקה אם האלמנט נמצא
  if (audio) {
    audio.play();
  } else {
    console.error("אלמנט השמע לא נמצא");
  }
}

function clearBoard() {
  ctx.beginPath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillRect(0, 0, BoardSize.cols * squareSize, BoardSize.rows * squareSize);
}

//פןמקציה שמציירת לוח משבצות
function drawGrid() {
  startPoint = {};
  endPoint = {};

  //ציור הקווים האופקיים
  startPoint.col = 0;
  endPoint.col = BoardSize.cols;

  for (i = 0; i < BoardSize.rows; i++) {
    startPoint.row = i;
    endPoint.row = i;
    drawLine(startPoint, endPoint);
  }

  //ציור הקווים האנכיים
  startPoint.row = 0;
  endPoint.row = BoardSize.rows;

  for (i = 0; i < BoardSize.cols; i++) {
    startPoint.col = i;
    endPoint.col = i;
    drawLine(startPoint, endPoint);
  }
}

//פונקציה של ציור שורה
function drawLine(startPoint, endPoint) {
  ctx.beginPath();
  ctx.moveTo(startPoint.col * squareSize, startPoint.row * squareSize);
  ctx.lineTo(endPoint.col * squareSize, endPoint.row * squareSize);
  ctx.stroke();
}

//פונקציה למילוי משבצת
function fillSquare(square) {
  ctx.beginPath();
  ctx.fillStyle = "#000000";
  ctx.fillRect(
    square.col * squareSize,
    square.row * squareSize,
    squareSize,
    squareSize
  );
}
