import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }],
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;

  constructor(private auth: AuthService, private alertify: AlertifyService, private router: Router) {}

  ngOnInit(): void {
    this.auth.photoUrl.subscribe((p) => (this.photoUrl = p));
  }

  login() {
    this.auth.login(this.model).subscribe(
      (next) => {
        this.alertify.success('Logged in succesfully');
      },
      (error) => {
        this.alertify.error('Failed to login');
      },
      () => {
        this.router.navigate(['/members']);
      }
    );
  }

  getUserName() {
    return this.auth.decodedToken?.unique_name ?? '';
  }

  loggedIn() {
    return this.auth.loggedIn();
  }

  logout() {
    this.auth.logout();
    this.alertify.success('Logged out');
    this.router.navigate(['/home']);
  }
}
