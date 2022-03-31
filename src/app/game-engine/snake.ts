import { UserKeyInput } from "./input";

export const SNAKE_SPEED = 190;

export class Snake {
  snakeBody = [
    { x: 20, y: 20 }
  ];

  newSegments = 0
  input = new UserKeyInput();

  listenToInputs() {
    this.input.getInputs();
  }

  update() {
    this.addSegments();
    const inputDirection =  this.input.getInputDirection();
    for (let i = this.snakeBody.length - 2; i >= 0; i--) {
      this.snakeBody[i + 1] = { ...this.snakeBody[i] }
    }
    this.snakeBody[0].x += inputDirection.x;
    this.snakeBody[0].y += inputDirection.y;
    this.crossBorders();
  }

crossBorders() {
  if(this.snakeBody[0].y < 1) {
    this.snakeBody[0].y = 30
  }
  if(this.snakeBody[0].y > 30) {
    this.snakeBody[0].y = 1
  }
  if(this.snakeBody[0].x < 1) {
    this.snakeBody[0].x = 30
  }
  if(this.snakeBody[0].x > 30) {
    this.snakeBody[0].x = 1
  }
}

  draw(gameBoard: any) {
    this.snakeBody.forEach(segment => {
      const snakeElement = document.createElement('div');
      snakeElement.style.gridRowStart = segment.y.toString();
      snakeElement.style.gridColumnStart = segment.x.toString();
      snakeElement.classList.add('snake');
      gameBoard.appendChild(snakeElement);
    });
  }

  expandSnake(amount: number) {
    this.newSegments += amount;
  }

  getSnakeHead() {
    return this.snakeBody[0];
  }

  snakeIntersection() {
    return this.onSnake(this.snakeBody[0], { ignoreHead: true });
  }


  onSnake(position: any, { ignoreHead = false } = {}) {
    return this.snakeBody.some((segment, index) => {
      if (ignoreHead && index === 0) return false;
      return this.equalPositions(segment, position);
    })
  }

  equalPositions(pos1: any, pos2: any) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
  }

  addSegments() {
    for (let i = 0; i < this.newSegments; i++) {
      this.snakeBody.push({ ...this.snakeBody[this.snakeBody.length - 1] });
    }

    this.newSegments = 0;
  }

}
