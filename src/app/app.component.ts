import { stringify } from '@angular/compiler/src/util';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { User } from './user.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private usersSub: Subscription = new Subscription;
  private userSub: Subscription = new Subscription;
  private authListenerSubs: Subscription | undefined;
  userId: string | undefined;
  users: Array<User> = [];
  user: User | undefined;
  userIsAuthenticated = false;
  constructor(private authService: AuthService) {}

  ngOnInit(){

    this.authService.autoAuthUser();
    this.userId = this.authService.getUserId();
    this.authService.getUsers();
    // this.usersSub = this.authService.getUsersUpdateListener().subscribe((usersData: {users: Array<User>}) => {
    //   this.users = usersData.users;
    //   this.users.sort((a, b) => (a.score > b.score) ? 1 : -1);
    //   this.users.reverse();

    // })

    if(this.userId) {
      this.authService.getAuthUser(this.userId as any);
      // this.userSub = this.authService.getUserUpdateListener().subscribe((userDate: {user: User}) => {
      //   this.user = userDate.user;

      // })
    }
  }

  ngOnDestroy() {
    // this.usersSub.unsubscribe();
    // this.userSub.unsubscribe();
  }
}
