import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { AuthService } from './_services/auth.service';
import { AlertifyService } from './_services/alertify.service';
import { UserService } from './_services/user.service';
import { AuthGuard } from './_guard/auth.guard';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { MembersEditComponent } from './members/members-edit/members-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guard/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';
import { TimeagoModule } from 'ngx-timeago';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { HasRoleDirective } from './_directives/hasRole.directive';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';
import { AdminService } from './_services/admin.service';
import { RolesModalComponent } from './admin/roles-modal/roles-modal.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    AdminPanelComponent,
    NavComponent,
    HomeComponent,
    RolesModalComponent,
    RegisterComponent,
    MemberListComponent,
    ListsComponent,
    MemberCardComponent,
    MessagesComponent,
    MemberDetailComponent,
    MembersEditComponent,
    PhotoEditorComponent,
    MemberMessagesComponent,
    HasRoleDirective,
    UserManagementComponent,
    PhotoManagementComponent,
  ],
  imports: [
    FileUploadModule,
    BsDatepickerModule.forRoot(),
    BrowserModule,
    ModalModule.forRoot(),
    HttpClientModule,
    TimeagoModule.forRoot(),
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxGalleryModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/auth'],
      },
    }),
  ],
  providers: [
    MemberDetailResolver,
    AdminService,
    MemberListResolver,
    MemberMessagesComponent,
    AuthService,
    AlertifyService,
    UserService,
    AuthGuard,
    PreventUnsavedChanges,
    MemberEditResolver,
    ListsResolver,
    MessagesResolver,
  ],
  entryComponents: [RolesModalComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
