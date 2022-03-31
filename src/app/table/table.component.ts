import { AfterViewInit, Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { GameService } from '../posts/game.service';
import {User} from "../user.model"
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  gameBoard: any;
  @Input() users: Array<User> = [];
  @Input() authUser: User | undefined;
  userIsAuthenticated = false;
  constructor(public authService: AuthService, public gameService: GameService) { }
  ngOnInit(): void {

  }

}
