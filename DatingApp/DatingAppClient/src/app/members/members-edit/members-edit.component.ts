import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-members-edit',
  templateUrl: './members-edit.component.html',
  styleUrls: ['./members-edit.component.css'],
})
export class MembersEditComponent implements OnInit {
  @ViewChild('editForm', { static: true }) editForm: NgForm;

  user: User;
  photoUrl: string;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'];
    });

    this.auth.currentPhotUrl.subscribe((p) => (this.photoUrl = p));
  }

  updateUser() {
    this.userService.updateUser(this.auth.decodedToken.nameid, this.user).subscribe(
      (next) => {
        this.alertify.success('Update correctly');
        this.editForm.reset(this.user);
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }

  updateMainPhoto(photoUrl: string) {
    this.user.photoUrl = photoUrl;
  }
}
