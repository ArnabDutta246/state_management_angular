import { Injectable, Type } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { AdminLoginService } from "./admin-login.service";

@Injectable({
  providedIn: "root",
})
export class AuthService implements CanActivate, CanActivateChild {
  userStatus: any;
  constructor(
    private loginService: AdminLoginService,
    private router: Router
  ) {}
  //canActivated route configure
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginService.isAd().then((res) => {
      if (res) {
        return true;
      } else {
        this.loginService.logout();
        return false;
      }
    });
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
