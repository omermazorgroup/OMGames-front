import { DoBootstrap, NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http"
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.components';

import { GameService } from './posts/game.service';
import { FormsModule } from "@angular/forms";
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor} from './error-interceptor'
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';
import { SnakeComponent } from './snake.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { TableComponent } from './table/table.component';
import { ContactComponent} from './contact.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    SnakeComponent,
    GameBoardComponent,
    TableComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule,
    FormsModule,
    NgbModule
    // FontAwesomeModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}, GameService],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule  {


}

