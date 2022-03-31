import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isVerify = false;
  isLoading = false;
  isSend = false;
  timer = this.authService.timer;
  text: string | undefined;
  setInterval: any;
  email: string | undefined;
  userIsAuthenticated = this.authService.getIsAuth();
  private authStatusSub: Subscription | undefined;
  private usernameSub: Subscription = new Subscription;
  usernames: Array<string> = [];
  errors: Array<string> = [];
  constructor(public authService: AuthService, private router: Router){}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.authService.getUsernames();
    this.usernameSub = this.authService.getUsernameUpdateListener().subscribe((usernamesData: {usernames: Array<string>}) => {
      this.usernames = usernamesData.usernames;
    })
  }

  onSignup(form: NgForm){
    var date = new Date(form.value.birthday);
    var ageDifMs = Date.now() - date.getTime();
    var ageDate = new Date(ageDifMs);
    var year = ageDate.getUTCFullYear();
    var age = Math.abs(year - 1970);
    var regex = /([,\.\:!\?])/;
    this.errors = [];
    if (form.invalid){
      return;
    }
    if(this.usernames.includes(form.value.username)) {
      this.errors.push("Username already exists");
    }
    if(form.value.username.charAt(0).match(regex)) {
      this.errors.push("Username must begin with letters");
    }
    if(form.value.password.length < 8) {
      this.errors.push("Password need to contain at least 8 words");
    }
    if(!isNaN(form.value.password)) {
      this.errors.push("Password must include numbers and letters");
    }
    if(form.value.password !== form.value.password2) {
      this.errors.push("Passwords are not match");
    }
    if(this.errors.length > 0){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.username, this.email as any, form.value.password, form.value.address);
  }



  onEmail(form: NgForm){

    this.isLoading = true;
    if(this.userIsAuthenticated) {
      this.router.navigate(['/']);
      return;
    }
     if(form.invalid){
       return;
     }
     this.authService.next(form.value.email).subscribe(response => {
      this.isLoading = false;
      if(this.authService.isEmailExist) {
        this.text = "Email is already exist!";
        return;
      }
      this.isSend = true;
        this.setInterval= setInterval(() => {
          this.timer --;
          if(this.timer === 0) {
            this.router.navigate(['/']);
            clearInterval(this.setInterval)
          }
        }, 1000)


    })

    }

    onVerify(form: NgForm){
      this.authService.onVerify(form.value.random).subscribe(response => {
        if(!this.authService.isVerify){
          this.text = `Try again!`
        }
        else{
          clearInterval(this.setInterval)
          this.isVerify = true;
          this.isVerify = true;
          this.email = this.authService.email;
          setTimeout(() => {
            this.isLoading = false;
          },1000);

        }
      })
     }

  ngOnDestroy() {
    this.authStatusSub?.unsubscribe();
  }
}
