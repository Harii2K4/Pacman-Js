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
    setInterval(() => this.currFrame++, 100);
  }

  update() {
    this.currFrame = this.currFrame <= this.totalFrames ? this.currFrame : 1;
    this.changeDirection();
    this.moveForward();
    if (this.checkCollison()) {
      console.log("collide");
      this.moveBack();
    }
    // console.log(this.x, this.y);
  }

  setDirection(keycode) {
    console.log(keycode);
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
  }
}
