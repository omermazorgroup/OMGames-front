import { AfterViewInit, Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from './auth/auth.service';
import {User} from "./user.model"
@Component({
  templateUrl: './contact.component.html',
  styleUrls: []
})
export class ContactComponent implements OnInit {
  gameBoard: any;
  userIsAuthenticated = false;
  constructor(public authService: AuthService) { }
  ngOnInit(): void {

  }

}
