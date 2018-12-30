import { Component, OnInit } from '@angular/core';
import { CoreService, AuthenticationService, AuthService, CoreProxies } from 'ac-core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  ngOnInit() {}

  constructor(
    public authService: AuthenticationService,
    private auth: AuthService,
    private coreProxy: CoreProxies,
    private coreService: CoreService
  ) {}


  login() {
    this.authService.login(this.email, this.password).subscribe(
      data => {
        console.log('data', data);
      },
      error => {
        console.log(error);
      }
    );
  }

  signup() {
    this.coreProxy
      .createUsuario({
        mail: this.email,
        password: this.password
      })
      .subscribe(r => {
        console.log(r);

        this.coreService.setToast({
          type: 'success',
          title: 'Registración',
          body: 'Por favor aguarde a que el administrador se comunique con usted'
        });
      });
  }

  logout() {
    this.authService.logout();
  }
}
