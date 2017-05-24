import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { AdminGuard } from './guards/admin.guard';
import { StudentGuard } from './guards/student.guard';
import { AccessDeniedComponent } from './error_pages/access-denied/access-denied.component';
import { BadRequestComponent } from './error_pages/bad-request/bad-request.component';
import { NotFoundComponent } from './error_pages/not-found/not-found.component';
import { LoginGuard } from './guards/login.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccessDeniedComponent,
    BadRequestComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    NgbModule.forRoot()
  ],
  providers: [LoginService, AdminGuard, StudentGuard, LoginGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
