import { TOUCH_BUFFER_MS } from "@angular/cdk/a11y";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import {CreateData} from "./create-data.model";
import { AuthEmail } from "./auth-email.model";
import { environment} from "../../environments/environment";
import { take, tap } from "rxjs/operators";
import { User } from "../user.model";



const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({providedIn: "root"})
export class AuthService {
  public isAuthenticated = false;
  private token: string | undefined;
  private tokenTimer: any;
  private userId: string | any;
  private authStatusListener = new Subject<boolean>();
  timer = 60;
  email = '';
  isEmailExist = true;
  isVerify = false;
  private usernameUpdated = new Subject<{ usernames: Array<string>}>();
  private usersUpdated = new Subject<{ users: Array<User>}>();
  private userUpdated = new Subject<{ user: User}>();
  text: string | undefined;
  usernames: Array<string> = [];
  users: Array<User> = [];
  user: User | undefined;
  userLevel: Array<User> | undefined;
  winner: User | undefined;
  usersLoading = false;
  constructor(private http: HttpClient, private router: Router){}
  getUsernames() {
    return this.http.get<{usernames: Array<string>}>(BACKEND_URL + "/getUsernames").subscribe(response => {
      this.usernames = response.usernames;
      this.usernameUpdated.next({usernames:[...this.usernames]});
      })
  }
  next(email: string){
    const authEmail: AuthEmail = {email: email};
    return this.http.post<{email: string, isEmailExist: boolean}>(BACKEND_URL + "/checkEmail", authEmail).pipe(tap((response) => {
      this.email = response.email;
      this.isEmailExist = response.isEmailExist;
    }))
  }
  onVerify(random: number) {
    let randomData = {random: random}
    return this.http.post<{isVerify: boolean}>(BACKEND_URL + "/onVerify", randomData).pipe(tap((response) => {
      this.isVerify = response.isVerify
    }))
  }
  getUsers() {
    this.usersLoading = true;
    return this.http.get<{users: Array<User>}>(BACKEND_URL + "/getUsers").subscribe(response => {
      this.users = response.users;
      this.usersLoading = false
      this.orderUsers(this.users);
      this.usersUpdated.next({users:[...this.users]});
      })
  }

  getAuthUser(id: string) {
  return this.http.get<{user: User}>(BACKEND_URL + "/getAuthUser/" + id).subscribe(response => {
    this.user = response.user;
    this.rankUsers(this.users, this.user);
    console.log(this.user);
      this.userUpdated.next({user:this.user});
      })
  }

  rankUsers(users: Array<User>, user: User) {
    const userIndex = users.findIndex((u => u.username === user.username));

    if(this.user) {
    if(users[userIndex]) {
      this.user.rank = users[userIndex].rank;
      users[userIndex] = user;
      if(this.user.rank >= 50) {
        this.userLevel = [users[userIndex]];
        users.splice(userIndex, 1);
      }
      else {
        this.orderUsers(users);
      }
    }
      let min = users[users.length - 1];
      this.checkIfUserScoreIsMoreThenMinimum(users, min);
    }
  }


  orderUsers(users: Array<User>) {
    if(users.length > 50) {
      users.length = 50;
    }
    users.sort((a, b) => (a.score > b.score) ? 1 : -1);
    users.reverse();
    users.forEach(function callback(user, index) {
      user.rank = index + 1;
    })
  }


  checkIfUserScoreIsMoreThenMinimum(users: Array<User>, min: User) {
    if(this.userLevel && this.userLevel[0].score > min.score) {
      users.push(...this.userLevel);
      this.userLevel = undefined
      this.orderUsers(users);
    }
  }

  getUsernameUpdateListener(){
    return this.usernameUpdated.asObservable();
  }

  getUsersUpdateListener(){
    return this.usersUpdated.asObservable();
  }

  getUserUpdateListener(){
    return this.userUpdated.asObservable();
  }

  getToken(){
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

getUserId(){
  return this.userId;
}

getWinner(){
  this.getUsers();
  this.winner = this.users[0];
  return this.winner;
}

getAuthStatusListener() {
  return this.authStatusListener.asObservable();
}

createUser(username: string, email: string, password: string, address: string){
  const createData :  CreateData = {username: username, email: email, password: password, address: address};
  return this.http.post<{isSignup: boolean}>(BACKEND_URL + "/signup", createData).subscribe(() => {
    this.text = "User created successfully!"
    this.router.navigate(["/"]);
  }, error => {
    this.authStatusListener.next(false);
  });
}
  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string, user: User}>(BACKEND_URL + "/login", authData)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.userId = response.userId;
        this.getAuthUser(this.userId);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate, this.userId);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    })
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if (!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation?.expirationDate.getTime() as any - now.getTime();
    if (expiresIn > 0){
      this.token = authInformation?.token;
      this.isAuthenticated = true;
      this.userId  = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

editUser(address: string) {
  const createData = {address: address};
  return this.http.put<{}>(BACKEND_URL + "/editUser", createData).subscribe(() => {

  }, error => {
  });
}

  logout() {

    this.token = null as any;
    this.isAuthenticated = false;
    this.user = undefined;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    this.clearAuthData();
    this.userId = null as any;
    clearTimeout(this.tokenTimer);
    window.location.reload();

  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration")
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
