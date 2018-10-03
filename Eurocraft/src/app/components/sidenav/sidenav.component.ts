import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { AuthService } from '../../core/services/auth.service';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  private mediaMatcher: MediaQueryList =
    matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  isDarkTheme: boolean = false;

  constructor(
    zone: NgZone,
    private _authService: AuthService,
    private router: Router) {
    this.mediaMatcher.addListener(mql =>
      zone.run(() => this.mediaMatcher = mql));
  }

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      if (this.isScreenSmall())
        this.sidenav.close();
    });
  }

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }

  isLoggedIn() {
    return this._authService.isLoggedIn();
  }

  isAdmin() {
    return this._authService.authContext &&
      this._authService.authContext.Claims &&
      (this._authService.authContext.Claims.find(c =>
        c.Type === 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' &&
        c.Value === 'Administrators'));
  }
}
