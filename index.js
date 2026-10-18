const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

//Constants
const WALLSIZE = 20; //because the animation has 20px width
const WALLCOLOR = "#3e34ee";
const WALLGAP = WALLSIZE / 1.5;
const WALLOFFSET = (WALLSIZE - WALLGAP) / 2;
const FPS = 60;

const DIRECTION_RIGHT = 1;
const DIRECTION_DOWN = 2;
const DIRECTION_LEFT = 3;
const DIRECTION_UP = 4;

const MAP_ROW = 23;
const MAP_COLN = 21;

//Map
let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
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
function createRect(x, y, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

// x => j , y => i (remember)
function drawBoard() {
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
    }
  }
}

function update() {
  //Todo
}
function render() {
  //Todo
}

let gameLoop = () => {
  update();
  render();
};

drawBoard();
