const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const pacmanImg = document.querySelector("#animations");
const ghostImg = document.querySelector("#ghost");

//Constants
const PACMANSIZE = 20; //width animations is 140(width) x 20 (height)
const WALLSIZE = 20; //because the pacman animation has 20px width
const WALLCOLOR = "#3e34ee";
const WALLGAP = WALLSIZE / 1.5;
const WALLOFFSET = (WALLSIZE - WALLGAP) / 2;
const FPS = 60;
const SPEED = 75;

const DIRECTION_RIGHT = 1;
const DIRECTION_DOWN = 2;
const DIRECTION_LEFT = 3;
const DIRECTION_UP = 4;

const MAP_ROW = 23;
const MAP_COLN = 21;

//vars
let visited = new Set();
let gameLoopID = null;
let pacman = null;
let map = null;
let isRunnning = false;

//Map
function createMap() {
  return [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 2, 2, 2, 2],
    [2, 2, 2, 2, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
}

function createCoin(i, j) {
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.arc(
    j * WALLSIZE + WALLSIZE / 2,
    i * WALLSIZE + WALLSIZE / 2,
    WALLSIZE / 4,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.closePath();
}

function createRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

// x => j , y => i (remember)
function renderBoard() {
  ctx.clearRect(0, 0, 500, 500);
  for (let i = 0; i < MAP_ROW; i++) {
    for (let j = 0; j < MAP_COLN; j++) {
      //walls
      if (map[i][j] === 1) {
        createRect(j * WALLSIZE, i * WALLSIZE, WALLSIZE, WALLSIZE, WALLCOLOR);

        if (j > 0 && map[i][j - 1] === 1) {
          createRect(
            j * WALLSIZE,
            i * WALLSIZE + WALLOFFSET,
            WALLGAP + WALLOFFSET,
            WALLGAP,
            "black",
          );
        }

        if (j < MAP_COLN - 1 && map[i][j + 1] === 1) {
          createRect(
            j * WALLSIZE + WALLOFFSET,
            i * WALLSIZE + WALLOFFSET,
            WALLGAP + WALLOFFSET,
            WALLGAP,
            "black",
          );
        }

        if (i > 0 && map[i - 1][j] === 1) {
          createRect(
            j * WALLSIZE + WALLOFFSET,
            i * WALLSIZE,
            WALLGAP,
            WALLGAP + WALLOFFSET,
            "black",
          );
        }

        if (i < MAP_ROW - 1 && map[i + 1][j] === 1) {
          createRect(
            j * WALLSIZE + WALLOFFSET,
            i * WALLSIZE + WALLOFFSET,
            WALLGAP,
            WALLGAP + WALLOFFSET,
            "black",
          );
        }
      }
      //coins
      else if (map[i][j] === 0) {
        createCoin(i, j);
      }
    }
  }
  ctx.fillStyle = "black";
}

function update() {
  pacman.update();
}

function render() {
  renderBoard();
  pacman.render();
}

let gameLoop = () => {
  update();
  render();
};

let newPacman = () => {
  return new Pacman(
    PACMANSIZE,
    PACMANSIZE,
    PACMANSIZE,
    PACMANSIZE,
    SPEED / FPS,
    DIRECTION_RIGHT,
  );
};

let startGame = () => {
  pacman = newPacman();
  map = createMap();
  isRunnning = true;
  gameLoopID = setInterval(gameLoop, 1000 / FPS);
};

let resetGame = () => {
  if (isRunnning === false) return;

  isRunnning = false;
  if (gameLoopID != null) {
    clearInterval(gameLoopID);
  }

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.font = '32px "Press Start 2P", monospace';
  ctx.fillStyle = "#FF0000";
  ctx.fillText(
    `GAME OVER`,
    (MAP_COLN / 2) * WALLSIZE,
    (MAP_ROW / 2) * WALLSIZE,
  );

  ctx.font = '16px "Press Start 2P", monospace';
  ctx.fillStyle = "#FFD700";
  ctx.fillText(
    `SCORE ${String(pacman.score).padStart(4, "0")}`,
    (MAP_COLN / 2) * WALLSIZE,
    (MAP_ROW / 2) * WALLSIZE + 2 * WALLSIZE,
  );

  ctx.fillStyle = "#00FFFF";
  ctx.fillText(
    `Press Enter For New Game`,
    (MAP_COLN / 2) * WALLSIZE,
    (MAP_ROW / 2) * WALLSIZE + 4 * WALLSIZE,
  );
  ctx.restore();

  ctx.fillRect(0, MAP_ROW * WALLSIZE, 500, 32);
};

function welcomeScreen() {
  ctx.save();
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.font = "bold 20px serif";
  ctx.fillStyle = "#F5F5F5";
  ctx.fillText(
    `Press Enter To Start And Escape To Stop`,
    (MAP_COLN / 2) * WALLSIZE,
    (MAP_ROW / 2) * WALLSIZE,
  );
  ctx.restore();
}

welcomeScreen();

document.body.addEventListener("keydown", (event) => {
  let keycode = event.code;

  if (
    ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
      keycode,
    )
  ) {
    event.preventDefault();
  }

  if (keycode === "Escape" && isRunnning === true) {
    resetGame();
  }

  if (keycode === "Enter" && isRunnning === false) {
    startGame();
  }

  pacman.setDirection(keycode);
});
