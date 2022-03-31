import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";


import {Score} from '../score.model';
import { GameService } from "../game.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: "First Post", content: "This is first post\'s content"},
  //   {title: "Second Post", content: "This is second post\'s content"},
  //   {title: "Third Post", content: "This is third post\'s content"},
  // ];
//  posts : Post[] = [];
 isLoading = false;
 totalPosts = 0;
 postsPerPage = 2;
 currentPage = 1;
 pageSizeOptions = [1, 2, 5, 10];
 userIsAuthenticated = false;
 userId: string | undefined;
 private postsSub: Subscription = new Subscription;
private authStatusSub: Subscription = new Subscription;

constructor(public gameService: GameService, private authService: AuthService){

}
ngOnInit(){
    this.isLoading = true;
  //  this.gameService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
  //  this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
  //   this.isLoading = false;
  //   this.totalPosts = postData.postCount;
  //   this.posts = postData.posts;
  // });
  this.userIsAuthenticated = this.authService.getIsAuth();
this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
  this.userIsAuthenticated = isAuthenticated;
  this.userId = this.authService.getUserId();
});

}

onChangedPage(pageData: PageEvent) {
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.postsPerPage = pageData.pageSize;
  // this.postsService.getPosts(this.postsPerPage, this.currentPage);
}

onDelete(postId: string){
  this.isLoading = true;
  // this.postsService.deletPost(postId).subscribe(() => {
  //   this.postsService.getPosts(this.postsPerPage, this.currentPage)
  // }, () => {
  //   this.isLoading = false
  // });

}

ngOnDestroy(){
  this.postsSub.unsubscribe();
  this.authStatusSub.unsubscribe();
}
}
