import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Food } from '../game-engine/food';
import { outsideGrid } from '../game-engine/gameboard-grid.util';
import { Snake } from '../game-engine/snake';
import { GameService } from '../posts/game.service';
import { User } from '../user.model';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit, AfterViewInit {
  private usersSub: Subscription = new Subscription;
  lastRenderTime = 0
  gameOver = false
  gameBoard: any;
  SNAKE_SPEED = 20;
  snake = new Snake();
  food = new Food(this.snake, this.authService);
  ws = new WebSocket('wss://stream.binance.com:9443/ws/shibeur@trade');
  stockPriceElement: any;
  @Input() authUser: User | undefined;
  @Input() users: Array<User> | undefined;
  @Input() winner: User | undefined;
  userIsAuthenticated = false;
  time: string | undefined;
  // winner: User | undefined;
  distance: number | undefined;
  isEdit = false;
  isEditSend = false;
  constructor(public authService: AuthService, public gameService: GameService) { }

  ngOnInit(): void {
   this.stockPriceElement = document.getElementById('stock-price')
    this.ws.onmessage = (event) => {
      let stockObject = JSON.parse(event.data)
      this.stockPriceElement.innerText = (this.gameService.prize * (1 / parseFloat(stockObject.p))).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'SHIB';
    }
    this.snake.listenToInputs();
    this.timer();
    // this.usersSub = this.authService.getUsersUpdateListener().subscribe((usersData: {users: Array<User>}) => {
    //   // this.winner = this.authService.getTopUser()
    //   // this.timer(this.winner);
    // })
  }

  ngAfterViewInit(){
    this.gameBoard = document.querySelector('.game-board');
    window.requestAnimationFrame(this.start.bind(this));
  }

toggleEditForm() {
  this.isEdit = !this.isEdit
}

onEdit(form: NgForm) {
  if (form.invalid){
    return;
  }
  this.isEditSend = true;
  this.authService.editUser(form.value.address);
  setTimeout(() => {
    this.isEdit = false;
    this.isEditSend = false;
  },2000)
}

timer() {



var countDownDate = new Date("Apr 02, 2022 15:04:10").getTime();

var x = setInterval(() =>  {
  var now = new Date().getTime();
  this.distance = countDownDate - now;
  if(this.distance) {
    var days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
    this.time = days + "days " + hours + "h "
    + minutes + "m " + seconds + "s ";

    if (this.distance < 0) {
      this.authService.getWinner();
      clearInterval(x);
      // this.time = `The Winner Is: ${winner.username}`;
    }
  }

}, 1000);

}
  start(currentTime: any) {
    if(this.gameOver) return console.log('Game Over');

    window.requestAnimationFrame(this.start.bind(this));
    const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 700;
    if (secondsSinceLastRender < 1 / 20) return;
    this.lastRenderTime = currentTime;
    // console.log("rendering");
    this.update();
    this.draw();
  }


  get snakeSpeed() {
    const score = this.food.currentScore;
    if(score < 10) return 4;
    if(score > 10 &&  score < 15 ) return 5;
    if(score > 15 && score < 20 ) return 6;
    return 7;
  }

  dpadMovement(direction: string) {
    this.snake.input.setDirection(direction);
  }

  update() {
    this.snake.update();
    this.food.update();
    this.checkDeath();
  }

  draw() {
    this.gameBoard.innerHTML = '';
    this.snake.draw(this.gameBoard);
    this.food.draw(this.gameBoard);
  }

  checkDeath() {
    //outsideGrid(this.snake.getSnakeHead()) ||
    this.gameOver =  this.snake.snakeIntersection();
    if(!this.gameOver) return;
    if(!this.authService.isAuthenticated) return;
    this.gameService.addScore(this.food.score)
    this.gameBoard.classList.add("blur");
  }

  restart() {
    window.location.reload();
  }

}
