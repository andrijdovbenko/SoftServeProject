import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.loginService.checkLogged().map(resp => {
      let logged: string = resp['response'];
      if (logged !== 'logged') {
        return true;
      } else {
        let role = resp['roles'][1];
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'student') {
          this.router.navigate(['/student']);
        }
        return false;
      }
    });
  }
}
