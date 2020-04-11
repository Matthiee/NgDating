import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { Pagination } from '../_models/pagination';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private alertify: AlertifyService,
    private routes: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routes.data.subscribe((data) => {
      this.users = data.users.result;
      this.pagination = data.users.pagination;
    });

    this.likesParam = 'Likers';
  }

  loadUsers() {
    this.userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam)
      .subscribe(
        (result) => {
          this.users = result.result;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  pageChanged(event: any) {
    this.pagination.currentPage = event.page;

    this.loadUsers();
  }
}
