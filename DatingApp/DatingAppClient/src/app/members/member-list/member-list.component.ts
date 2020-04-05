import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  users: User[];

  constructor(private userSvc: UserService, private alertify: AlertifyService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userSvc.getUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }
}
