
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { AddOwnerComponent } from './components/add-owner/add-owner.component';
import {  HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { MatIconModule } from '@angular/material/icon';
import { NavMainComponent } from './components/nav-main/nav-main.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { MaterialModule } from '@/material/material.module';
import { LoginComponent } from './components/login/login.component';
import { PasswordComponent } from './components/password/password.component';
import { MessagesComponent } from './components/messages/messages.component';
import { PrimeNgModule } from '@/material/primeng.module';
import { FileUpload } from './components/upload/upload.component';
import { CrystalLightboxModule } from '@crystalui/angular-lightbox';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SignNewBusinessComponent } from './components/sign-new-business/sign-new-business.component';
import { SignNewClientComponent } from './components/sign-new-client/sign-new-client.component';
import { BusinessDisplayComponent } from './components/business-display/business-display.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserDisplayComponent } from './components/user-display/user-display.component';
import { BusinessListComponent } from './components/business-list/business-list.component';
import { NewMassageComponent } from './components/new-massage/new-massage.component';




@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    DataViewModule,
    DialogModule,
    FileUploadModule,
    HttpClientModule,
    MatIconModule,
    RouterModule,
    CrystalLightboxModule,
    MatCheckboxModule
  ],
  declarations: [
    NavMainComponent,
    SignUpComponent,
    LoginComponent,
    PasswordComponent,
    MessagesComponent,
    FileUpload,
    SignNewBusinessComponent,
    SignNewClientComponent,
    BusinessDisplayComponent,
    BusinessListComponent,
    AddOwnerComponent,
    UsersListComponent,
    UserDisplayComponent,
    EditUserComponent,
    NewMassageComponent,
  ],
  exports: [
    NavMainComponent,
    SignUpComponent,
    LoginComponent,
    PasswordComponent,
    DataViewModule,
    DialogModule,
    MessagesComponent,
    FileUpload,
    SignNewBusinessComponent,
    SignNewClientComponent,
    BusinessDisplayComponent,
    AddOwnerComponent,
    UsersListComponent,
    UserDisplayComponent,
    BusinessListComponent,
    MatIconModule,
  ],
  entryComponents: [
    EditUserComponent,
    NewMassageComponent,
    MessagesComponent
  ]
})
export class SharedModule { }
