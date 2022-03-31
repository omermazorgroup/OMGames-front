import { AuthService } from '../auth/auth.service';
import { randomGridPosition } from '../game-engine/gameboard-grid.util';

export class Food {
  EXPANSION_RATE = 1;
  score = 0;
  food: any;
  snake;
  constructor(snake: any, public authService: AuthService) {
    this.snake = snake;
    this.food = this.getRandomFoodPosition();
  }

  update() {
    if (this.snake.onSnake(this.food)) {
      this.snake.expandSnake(this.EXPANSION_RATE);
      this.food = this.getRandomFoodPosition();
      this.addScore = 1;



      if(this.authService.user && this.authService.user.score <= this.score) {
        this.authService.user!.score = this.score
        this.authService.rankUsers(this.authService.users, this.authService.user as any);

        // this.authService.users = updates[0] as any
        // this.authService.user = updates[1] as any
      }

    }
  }

  draw(gameBoard: any) {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = this.food.y;
    foodElement.style.gridColumnStart = this.food.x;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
  }


  getRandomFoodPosition() {
    let newFoodPosition;
    while (newFoodPosition == null || this.snake.onSnake(newFoodPosition)) {
      newFoodPosition = randomGridPosition()
    }
    return newFoodPosition;
  }

  set addScore(val: number) {
    this.score+=val;
  }

  get currentScore() {
    return this.score;
  }
}
