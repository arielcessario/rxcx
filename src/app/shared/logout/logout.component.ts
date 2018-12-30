import { Router } from '@angular/router';
import { AuthenticationService, CoreService } from 'ac-core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  logged = false;
  constructor(
    private router: Router,
    public authService: AuthenticationService,
    private coreService: CoreService
  ) {}
  ngOnInit() {
    this.logged = this.authService.getLoginStatus();
    this.coreService.getLoginStatus.subscribe((l: boolean) => {
      this.logged = l;
      if (!l) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/main']);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
