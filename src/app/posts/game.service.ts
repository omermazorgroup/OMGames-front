import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';
import { map, subscribeOn, take, tap } from 'rxjs/operators';
import { environment} from "../../environments/environment";
import { Score } from './score.model';
import { Router } from '@angular/router';
import { PostCreateComponent } from './post-create/post-create.component';
const BACKEND_URL = environment.apiUrl + "/posts/";
@Injectable({providedIn: 'root'})
export class  GameService {
  // private posts: Post[] = [];
  // private postsUpdated = new Subject<{ posts: Post[], postCount: number}>();
  views = (352).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  prize = parseFloat((250 + (parseInt(this.views) * 0.001)).toFixed(2));
  second = (this.prize / 2.5).toFixed(2);
  third = (parseFloat(this.second) / 2).toFixed(2);
  constructor(private http: HttpClient, private router: Router){

  }
addScore(score: number) {
    let scoreData: Score | FormData ;
     scoreData = {
      score: score
    };
  this.http.put(BACKEND_URL + '/addScore', scoreData).pipe(take(1))
  .subscribe(response => {

    // this.router.navigate(["/posts"]);
  });

}
//   getPosts(postsPerPage: number, currentPage: number){
//     const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
//     this.http
//     .get<{message: string, posts: Post[], maxPosts: number}>(
//     BACKEND_URL + queryParams)
//     // .pipe(map((postData) => {
//     //   return postData.posts.map(p => {
//     //     return {
//     //       title: p.title,
//     //       content: p.content,
//     //       _id: p._id
//     //     };
//     //   });
//     // }))
//     .subscribe(transformedPosts => {

//       console.log(transformedPosts);

//       this.posts = transformedPosts.posts;
//       this.postsUpdated.next({posts:[...this.posts], postCount: transformedPosts.maxPosts});
//     });
//     }



//   getPostUpdateListener(){
//     return this.postsUpdated.asObservable();
//   }

// getPost(id:string){
//   return this.http.get<{now:boolean,turbo:string,_id:string, title:string, content:string, imagePath: string, creator: string}>(BACKEND_URL + id);
// }

//   addPost(now:boolean, turbo:string, title:string, content: string, image: File){


//     const postData = new FormData();
//     let now2;
//     if (now === true){
//       now2 = "true";
//     }
//     else {
//       now2 = "false";
//     }
//     postData.append("now", now2);
//     postData.append("turbo", turbo);
//     postData.append("title", title);
//     postData.append("content", content);
//     postData.append("image", image);
//     this.http.post<{message: string, post: Post}>(BACKEND_URL, postData)
//     .subscribe((responseData) => {
//       this.router.navigate(["/posts"]);
//     });

//   }

// updatePost( id:string,now:boolean, turbo:string, title: string, content: string, image: File | string) {
//   let postData: Post | FormData ;
//   if(typeof(image) === 'object') {
//     postData = new FormData();
//     postData.append("_id", id);
//     postData.append("turbo", turbo)
//     postData.append("title", title);
//     postData.append("content", content);
//     postData.append("image", image, title);
//     //const post: Post = { _id:id, title:title, content:content, imagePath: null as any};
//   } else {
//      postData = {
//        now: false,
//        turbo: turbo,
//       _id: id,
//       title: title,
//       content: content,
//       imagePath: image,
//       creator: null as any
//     };
//   }
//   this.http.put(BACKEND_URL + id, postData)
//   .subscribe(response => {

//     this.router.navigate(["/posts"]);
//   });

// }

//   deletPost(postId: string){
//    return this.http.delete(BACKEND_URL  + postId)

//   }
}
