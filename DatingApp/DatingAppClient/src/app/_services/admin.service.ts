import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = `${environment.apiUrl}/admin`;
  constructor(private http: HttpClient) {}

  getUserWithRoles() {
    return this.http.get<User[]>(`${this.baseUrl}/userWithRoles`);
  }
}
