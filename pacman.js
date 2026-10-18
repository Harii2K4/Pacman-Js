class Pacman {
  constructor(x, y, height, width, speed, direction) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.speed = speed;
    this.direction = direction;
    this.newDirection = direction;
  }

  update() {
    this.changeDirection();
    this.moveForward();
    if (this.checkCollison()) {
      this.moveBack();
    }
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
    //todo
  }

  moveForward() {
    //todo
  }

  changeDirection() {
    //todo
  }

  checkCollison() {
    //todo
  }

  render() {
    //todo
  }
}
