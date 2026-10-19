class Pacman {
  constructor(x, y, width, height, speed, direction) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.speed = speed;
    this.direction = direction;
    this.newDirection = direction;
    this.currFrame = 1;
    this.totalFrames = 7;
    this.score = 0;
    this.intervalId = setInterval(() => this.currFrame++, 100);
  }

  update() {
    this.currFrame = this.currFrame <= this.totalFrames ? this.currFrame : 1;
    this.changeDirection();
    this.moveForward();
    if (this.checkCollison() || this.outOfBounds()) {
      this.moveBack();
    }
    this.eatCoin();
    // console.log(this.x, this.y);
    // console.log(this.score);
    // console.log(visited);
  }

  eatCoin() {
    // let x = this.getLeftIdx();
    // let y = this.getTopIdx();
    let x = Math.floor((this.x + this.width / 2) / PACMANSIZE);
    let y = Math.floor((this.y + this.height / 2) / PACMANSIZE);

    if (map[y][x] == 0) {
      this.score++;
      map[y][x] = -1;
    }
  }

  outOfBounds() {
    return this.x < 0 || this.x > (MAP_COLN - 1) * WALLSIZE;
  }

  setDirection(keycode) {
    let tempDir = null;
    if (keycode === "ArrowLeft" || keycode === "KeyA") {
      tempDir = DIRECTION_LEFT;
    } else if (keycode === "ArrowDown" || keycode === "KeyS") {
      tempDir = DIRECTION_DOWN;
    } else if (keycode === "ArrowRight" || keycode === "KeyD") {
      tempDir = DIRECTION_RIGHT;
    } else if (keycode === "ArrowUp" || keycode === "KeyW") {
      tempDir = DIRECTION_UP;
    }
    if (tempDir === null) return;
    this.newDirection = tempDir;
  }

  moveBack() {
    switch (this.direction) {
      case DIRECTION_RIGHT:
        this.x -= this.speed;
        break;
      case DIRECTION_DOWN:
        this.y -= this.speed;
        break;
      case DIRECTION_UP:
        this.y += this.speed;
        break;
      case DIRECTION_LEFT:
        this.x += this.speed;
        break;
    }
  }

  moveForward() {
    switch (this.direction) {
      case DIRECTION_RIGHT:
        this.x += this.speed;
        break;
      case DIRECTION_DOWN:
        this.y += this.speed;
        break;
      case DIRECTION_UP:
        this.y -= this.speed;
        break;
      case DIRECTION_LEFT:
        this.x -= this.speed;
        break;
    }
  }

  changeDirection() {
    if (this.newDirection === null || this.newDirection === this.direction) {
      return;
    }
    let oldDirection = this.direction;
    this.direction = this.newDirection;
    this.moveForward();
    if (this.checkCollison()) {
      this.moveBack();
      this.direction = oldDirection;
    } else {
      this.moveBack();
      this.newDirection = null;
    }
  }

  checkCollison() {
    let topLeftCheck = map[this.getTopIdx()][this.getLeftIdx()] === 1;
    let topRightCheck = map[this.getTopIdx()][this.getRightIdx()] === 1;
    let bottemLeftCheck = map[this.getBottemIdx()][this.getLeftIdx()] === 1;
    let bottemRightCheck = map[this.getBottemIdx()][this.getRightIdx()] === 1;

    return topLeftCheck || topRightCheck || bottemLeftCheck || bottemRightCheck;
  }

  getLeftIdx() {
    return Math.floor(this.x / WALLSIZE);
  }

  getRightIdx() {
    return Math.floor(this.x / WALLSIZE + 0.999);
  }

  getBottemIdx() {
    return Math.floor(this.y / WALLSIZE + 0.999);
  }

  getTopIdx() {
    return Math.floor(this.y / WALLSIZE);
  }

  render() {
    ctx.save();
    ctx.translate(this.x + PACMANSIZE / 2, this.y + PACMANSIZE / 2);
    ctx.rotate((this.direction - 1) * (Math.PI * 0.5));
    ctx.translate(-this.x - PACMANSIZE / 2, -this.y - PACMANSIZE / 2);
    ctx.drawImage(
      pacmanImg,
      (this.currFrame - 1) * PACMANSIZE,
      0,
      PACMANSIZE,
      PACMANSIZE,
      this.x,
      this.y,
      this.width,
      this.height,
    );
    ctx.restore();
    //render score
    ctx.save();
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillStyle = "#FFFFFF";
    ctx.textBaseline = "middle";
    ctx.fillText(
      `SCORE ${String(this.score).padStart(4, "0")}`,
      10,
      MAP_ROW * WALLSIZE + 20,
    );
    ctx.restore();
  }
}
