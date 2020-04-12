import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = `${environment.apiUrl}/admin`;
  constructor(private http: HttpClient) {}

  getUserWithRoles() {
    return this.http.get<User[]>(`${this.baseUrl}/userWithRoles`);
  }

  updateUserRoles(user: User, roles: {}) {
    return this.http.post(`${this.baseUrl}/editRoles/${user.userName}`, roles);
  }

  getPhotosForApproval() {
    return this.http.get<any[]>(`${this.baseUrl}/photosForModeration`);
  }

  approvePhoto(photoId) {
    return this.http.post(`${this.baseUrl}/approvePhoto/${photoId}`, {});
  }

  rejectPhoto(photoId) {
    return this.http.post(`${this.baseUrl}/rejectPhoto/${photoId}`, {});
  }
}
