import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    const roles = next.firstChild.data['roles'] as Array<string>;

    try {
      if (roles) {
        const match = this.authService.roleMatch(roles);

        if (!match) {
          this.router.navigate(['members']);
          this.alertify.error('You are not authorised to access this area');
        }
      }

      if (this.authService.loggedIn()) {
        return true;
      }

      this.alertify.error('You shall not pass!!!');
    } catch (error) {
      this.alertify.error('Something went wrong!');
      this.authService.logout();
    }

    this.router.navigate(['/home']);
  }
}
