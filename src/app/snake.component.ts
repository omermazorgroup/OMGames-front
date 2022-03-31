import { AfterViewInit, Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from './auth/auth.service';
import {User} from "./user.model"
@Component({
  templateUrl: './snake.component.html',
  styleUrls: []
})
export class SnakeComponent implements OnInit {
  gameBoard: any;
  @Input() users: Array<User> = [];
  @Input() authUser: User | undefined;
  userIsAuthenticated = false;
  constructor(public authService: AuthService) { }
  ngOnInit(): void {

  }

}
