import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.components.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input () userIsAuthenticated = false;
  private authListenerSubs: Subscription | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }
  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(){
    this.authListenerSubs?.unsubscribe();
  }
}
