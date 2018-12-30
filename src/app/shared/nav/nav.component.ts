import { Router } from '@angular/router';
import { element } from 'protractor';
import { AuthService } from './../../core/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { NbThemeService, NbSidebarService } from '@nebular/theme';
import { CoreService } from 'ac-core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  email: string;
  password: string;
  user: any;
  open: boolean = false;
  navOpen: string = '';
  position: string = 'left';
  userMenu = [];
  _theme: string = 'cosmic';

  constructor(
    private router: Router,
    private themeService: NbThemeService,
    private nbSidebarService: NbSidebarService,
    private coreService: CoreService
  ) {}

  ngOnInit() {
    this.setUser();
    this.coreService.getLoginStatus.subscribe(data => {
      console.log('login status');
      this.setUser();
    });
    this._theme = localStorage.getItem('THEME');

    // this.nbSidebarService.onToggle().subscribe(data=>{
    //   console.log(data);

    // })
  }

  setUser() {
    Object.keys(localStorage).forEach((element, i, a) => {
      if (element.indexOf('firebase:authUser') > -1) {
        setTimeout(() => {
          this.user = JSON.parse(localStorage.getItem(element));
        }, 100);
      }
    });
  }

  changeTheme() {
    // this.themeService.changeTheme('cosmic');

    this._theme = localStorage.getItem('THEME');
    if (this._theme === 'default') {
      this.themeService.changeTheme('cosmic');
      localStorage.setItem('THEME', 'cosmic');
    } else if (this._theme === 'cosmic') {
      this.themeService.changeTheme('corporate');
      localStorage.setItem('THEME', 'corporate');
    } else if (this._theme === 'corporate') {
      this.themeService.changeTheme('default');
      localStorage.setItem('THEME', 'default');
    }
  }

  toggleSidebar() {
    this.nbSidebarService.toggle(true, (this.open = !this.open).toString());
  }

  goToHome() {
    this.router.navigate(['/main']);
  }
  goToPerfil() {
    this.router.navigate(['/perfil']);
  }
}
