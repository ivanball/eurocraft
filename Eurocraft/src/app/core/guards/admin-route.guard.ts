import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AdminRouteGuard implements CanActivate {
  constructor(private _authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._authService.authContext &&
    this._authService.authContext.Claims &&
    !!this._authService.authContext.Claims.find(c => c.Type === 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' && c.Value === 'Administrators');
  }
}