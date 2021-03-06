import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = `${environment.apiUrl}/auth`;
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) {}

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post(`${this.baseUrl}/login`, model).pipe(
      map((r: any) => {
        const user = r;
        if (user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.decodedToken = null;
    this.currentUser = null;
  }

  init() {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const user = localStorage.getItem('user');

    if (user) {
      this.currentUser = JSON.parse(user);
      this.changeMemberPhoto(this.currentUser.photoUrl);
    }

    this.decodedToken = this.jwtHelper.decodeToken(token);
  }

  register(user: User) {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>;

    allowedRoles.forEach((element) => {
      if (userRoles.includes(element)) {
        isMatch = true;
      }
      return;
    });

    return isMatch;
  }
}
