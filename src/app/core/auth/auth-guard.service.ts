import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { CoreService } from '../core.service';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Logger } from '../logger/logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  static to = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private coreService: CoreService,
    private logger: Logger
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return true;
    // return this.auth.user
    //   .take(1)
    //   .map(user => !!user)
    //   .do(loggedIn => {
    //     if (!loggedIn) {
    //       console.log('access denied');
    //       this.logger.log('Error al crear usuario', 'access denied');
    //       this.router.navigate(['/login']);
    //     }
    //   });
  }

  // canActivate() {
  //     // console.log(this.router);

  //     let canActivate = false;

  //     Object.keys(localStorage).forEach(element => {
  //         if(element.indexOf('firebase:authUser') > -1){
  //             canActivate = true;
  //         }
  //     });

  //     // console.log(this.afa.auth);
  //     // if(this.afa.auth.currentUser){
  //     //     canActivate = true;
  //     // }

  //     if(canActivate){
  //         return canActivate;
  //     }

  //     // not logged in so redirect to login page
  //     this.router.navigate(['/login']);

  //     // this.coreService.setLoginStatus({showLogin: true});
  //     return canActivate;
  // }
}
