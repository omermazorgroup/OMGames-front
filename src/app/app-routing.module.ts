import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { GameBoardComponent } from './game-board/game-board.component';

import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.components';
import { SnakeComponent } from './snake.component';
import { ContactComponent} from './contact.component';

const routes: Routes = [
  { path: '', component: SnakeComponent},
  // { path: 'posts', component: PostListComponent /**, canActivate: [AuthGuard]  **/},
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  { path: 'contact', component: ContactComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
