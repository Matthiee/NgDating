import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private userService: UserService, private auth: AuthService, private alertify: AlertifyService) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUSerId = +this.auth.decodedToken.nameid;
    this.userService
      .getMessageThread(this.auth.decodedToken.nameid, this.recipientId)
      .pipe(
        tap((msgs) => {
          for (let i = 0; i < msgs.length; i++) {
            if (!msgs[i].isRead && msgs[i].recipientId === currentUSerId) {
              this.userService.markAsRead(currentUSerId, msgs[i].id);
            }
          }
        })
      )
      .subscribe(
        (response) => {
          this.messages = response;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;

    this.userService.sendMessage(this.auth.decodedToken.nameid, this.newMessage).subscribe(
      (message) => {
        console.log(message);
        this.messages.unshift(message);
        this.newMessage.content = '';
      },
      (error) => this.alertify.error(error)
    );
  }
}
