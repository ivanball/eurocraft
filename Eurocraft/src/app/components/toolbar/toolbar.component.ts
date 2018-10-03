import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  userName: string;

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit() {
    if (window.location.href.indexOf('?postLogout=true') > 0) {
      this._authService.signoutRedirectCallback().then(() => {
        let url: string = this._router.url.substring(
          0,
          this._router.url.indexOf('?')
        );
        this._router.navigateByUrl(url);
      });
    }
  }

  ngAfterViewInit() {
    //    this.userName = this.getUserName();
  }

  login() {
    this._authService.login();
  }

  logout() {
    this._authService.logout();
  }

  isLoggedIn() {
    return this._authService.isLoggedIn();
  }

  getUserName() {
    var userName: string = '';

    if (this._authService.authContext && this._authService.authContext.Claims && (this._authService.authContext.Claims.find(c => c.Type === 'name'))) {
      userName = (this._authService.authContext.Claims.find(c => c.Type === 'name')).Value;
      if (userName.indexOf('@') >= 0) {
        userName = userName.substring(0, userName.indexOf('@'));
      }
    }

    return userName;
  }
}
