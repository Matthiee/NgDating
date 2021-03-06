import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChanged = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  response: string;
  currentMain: Photo;

  baseUrl = environment.apiUrl;

  constructor(private auth: AuthService, private userService: UserService, private alertify: AlertifyService) {}

  ngOnInit() {
    this.initializeUploader();
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/users/${this.auth.decodedToken.nameid}/photos`,
      authToken: `Bearer ${localStorage.getItem('token')}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    // remove credentials CORS issue
    this.uploader.onAfterAddingFile = (file) => (file.withCredentials = false);

    this.uploader.onSuccessItem = (item, response, status, header) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo: Photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain,
          isPrivate: res.isPrivate,
          isApproved: res.isApproved,
        };

        this.photos.push(photo);

        if (photo.isMain) {
          this.updateCurrentUserPhoto(photo);
        }
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.auth.decodedToken.nameid, photo.id).subscribe(
      () => {
        this.currentMain = this.photos.filter((p) => p.isMain === true)[0];
        this.currentMain.isMain = false;
        photo.isMain = true;
        this.updateCurrentUserPhoto(photo);
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }

  private updateCurrentUserPhoto(photo: Photo) {
    this.auth.changeMemberPhoto(photo.url);
    this.auth.currentUser.photoUrl = photo.url;
    localStorage.setItem('user', JSON.stringify(this.auth.currentUser));
  }

  deletePhoto(id: number) {
    this.alertify.confirm('Are you sure you want to delete this photo?', () => {
      this.userService.deletePhoto(this.auth.decodedToken.nameid, id).subscribe(
        () => {
          this.photos.splice(
            this.photos.findIndex((p) => p.id === id),
            1
          );
          this.alertify.success('Photo has been deleted');
        },
        (error) => {
          this.alertify.error(error);
        }
      );
    });
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
