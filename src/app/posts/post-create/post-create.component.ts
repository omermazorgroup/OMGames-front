import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GameService } from '../game.service';
import { Score } from "../score.model"
import { mimeType } from "./mime-type.validator"
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import * as $ from 'jquery';
declare const myFun: any;
const publicVapidKey = 'BAIvjXC8VkxH6h_JIJVxhfnoo52DsOi4kmzbwDd3f46W8MKIERfSXT_jEXJA1DlHUU6YkqNabZjWcSBR6R-KNaM';
// if ('serviceWorker' in navigator){
//   send().catch(err => console.log(err));
// }
//Register SW, Register Push, Send Push
async function send() {
  console.log('Registering service worker...');
  const register = await navigator.serviceWorker.register('/worker.js', {
    scope: '/'
  });
  console.log('Service Worker Registered...');
  console.log('Registering Push...');
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log('Push Registered...');

  //Send Push Notification
  console.log('Sending Push...');
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log('Push Sent...');

}
function urlBase64ToUint8Array(base64String: any) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.components.css']
})

export class PostCreateComponent implements OnInit, OnDestroy{
  callFun(){
    myFun();
  }
  enteredContent = "";
  enteredTitle = "";
  isLoading = false;
  form!: FormGroup;
  form2!: FormGroup;
  imagePreview: string | undefined;
  imagePreview2: string | undefined;
  private mode = 'create';
  private postId: string | undefined;
  private authStatusSub: Subscription | undefined;
  // post: Post | undefined;

constructor(public postsService: GameService, public route: ActivatedRoute, private authService: AuthService){}

  ngOnInit(){
    // this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
    //   authStatus => {
    //     this.isLoading = false;
    //   }
    // );
    // this.form = new FormGroup({
    //    now: new FormControl(null),
    //    turbo: new FormControl(null, {validators:[Validators.required]}),
    //   title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)]
    //   }),
    //   content: new FormControl(null, {validators: [Validators.required]}),
    //   image: new FormControl(null, {asyncValidators: [mimeType]})
    // });
    // this.form2 = new FormGroup({
    //   now: new FormControl(null),
    //   turbo: new FormControl(null),
    //   title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)]
    //   }),
    //   content: new FormControl(null, {validators: [Validators.required]}),
    //   image: new FormControl(null, { asyncValidators: [mimeType]})
    // });
    // this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //   if (paramMap.has('postId')) {
    //     this.mode = 'edit'
    //     this.postId = paramMap.get('postId') as any
    //     this.isLoading = true;
    //     this.postsService.getPost(this.postId as any).subscribe(postData => {
    //       this.isLoading = false;
    //       this.post = {now:postData.now, turbo: postData.turbo, _id: postData._id, title:postData.title, content:postData.content, imagePath: postData.imagePath, creator: postData.creator}
    //       this.form?.setValue({now:this.post.now,turbo:this.post.turbo,title: this.post.title, content:this.post.content, image: this.post.imagePath});
    //       this.form2?.setValue({now:this.post.now,turbo:this.post.turbo,title: this.post.title, content:this.post.content, image: this.post.imagePath})
    //     });
    //   } else {
    //     this.mode = 'create';
    //     this.postId = null as any;
    //   }
    // });
  }

  // onImagePicked(event: Event){
  //   const file = ((event.target as HTMLInputElement).files)?.[0];
  //   this.form.patchValue({image: file});
  //   this.form.get('image')?.updateValueAndValidity();
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = reader.result as any;
  //   };
  //   reader.readAsDataURL(file as any);
  // }
  // onImagePicked2(event: Event){
  //   const file = ((event.target as HTMLInputElement).files)?.[0];
  //   this.form2.patchValue({image: file});
  //   this.form2.get('image')?.updateValueAndValidity();
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview2 = reader.result as any;
  //   };
  //   reader.readAsDataURL(file as any);
  // }
  // onSavePost(){

  //   if (this.form?.invalid){
  //     return;
  //   }
  //   this.isLoading = true;
  //   if (this.mode === 'create'){

  //     this.postsService.addPost(this.form?.value.now, this.form?.value.turbo, this.form?.value.title, this.form?.value.content, this.form?.value.image);


  //   } else {
  //     this.postsService.updatePost(this.postId as any,this.form?.value.now,this.form?.value.turbo, this.form?.value.title, this.form?.value.content, this.form?.value.image)
  //   }
  //   this.form?.reset();
  //   this.isLoading = false;

  // }
  // onSavePost2(){

  //   if (this.form2?.invalid){
  //     return;
  //   }
  //   this.isLoading = true;
  //   if (this.mode === 'create'){

  //     this.postsService.addPost(this.form2?.value.now ,this.form2?.value.turbo, this.form2?.value.title, this.form2?.value.content, this.form2?.value.image);



  //   } else {
  //     this.postsService.updatePost(this.postId as any,this.form2?.value.now, this.form2?.value.turbo, this.form2?.value.title, this.form2?.value.content, this.form2?.value.image)
  //   }
  //   this.form2?.reset();
  //   this.isLoading = false;

  // }
  ngOnDestroy() {
    this.authStatusSub?.unsubscribe();
  }
}

