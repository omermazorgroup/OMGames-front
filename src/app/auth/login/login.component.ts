import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription | undefined;
  userIsAuthenticated = this.authService.getIsAuth();
  constructor(public authService: AuthService, private router: Router){}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }
  onLogin(form: NgForm){
    if(this.userIsAuthenticated) {
      this.router.navigate(['/']);
      return;
    }
    if(form.invalid){
      return;
    }
    this.authService.login(form.value.email, form.value.password);

  }

  ngOnDestroy() {
    this.authStatusSub?.unsubscribe();
  }
}
