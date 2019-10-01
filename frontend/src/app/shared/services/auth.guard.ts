import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _router: Router, private authService: AuthenticateService) {

  }

  canActivate() {
    console.log("can activate called:", this.authService.isAuthenticated());
    if (this.authService.isAuthenticated()) {
      // return true;
      if (this.authService.isVerified()) {
        return true;
      } else {
        this._router.navigate(['/authentication/verify-confirm']);
        return false;
      }
    }

    this._router.navigate(['/pages/skills']);
    return false;
  }
}
