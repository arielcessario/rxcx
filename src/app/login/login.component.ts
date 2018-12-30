import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    Object.keys(localStorage).forEach(element => {
      if (element.indexOf('firebase:authUser') > -1) {
        this.router.navigate(['/main']);
      }
    });
  }

}
