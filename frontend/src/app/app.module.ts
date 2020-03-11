import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AvatarNameInitialsModule } from 'avatar-name-initials';
import { FileSelectDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './project/project.component';
import { TaskComponent } from './task/task.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { UserService } from './services/user.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { ProjectService } from './services/project.service';
import { AuthInterceptor } from './auth.interceptor';
import { TaskService } from './services/task.service';
import { ResetpassComponent } from './resetpass/resetpass.component';
import { SocketService } from './services/socket.service';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'project/:projectId', canActivate: [AuthGuard], component: ProjectComponent },
  { path: 'projects', canActivate: [AuthGuard], component: ProjectsComponent },
  { path: 'project/:projectId/task/:taskId', canActivate: [AuthGuard], component: TaskComponent },
  { path: 'reset', component: ResetpassComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    ProjectsComponent,
    ProjectComponent,
    TaskComponent,
    NavbarComponent,
    FooterComponent,
    FileSelectDirective,
    ResetpassComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    AvatarNameInitialsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    UserService,
    ProjectService,
    TaskService,
    SocketService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
