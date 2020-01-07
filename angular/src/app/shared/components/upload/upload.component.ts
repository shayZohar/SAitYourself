import { IUser } from './../../../user/interfaces/iuser';
import { Subject, Observable } from 'rxjs';
import { IImageFile } from './../../interfaces/IImageFile';
import { BusinessService } from './../../../business/services/business.service';
import { HttpUploadService } from './../../../core/http/http-upload.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpMessagesService } from '@/core/http/http-messages.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { IMessage, emptyMessage } from '@/shared/interfaces/IMessage';
import { SelectItem } from 'primeng/components/common/selectitem';


import {
  HttpEventType,
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import { forEach } from '@angular/router/src/utils/collection';
import { AuthenticationService } from '@/core/authentication/authentication.service';

@Component({
  selector: 'sh-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
// tslint:disable-next-line: component-class-suffix
export class FileUpload {
  uploadedFiles: any[] = [];
  selectedFile: File = null;
  fileList: File[];
  receivedFiles: IImageFile[];
  filesToDelete: IImageFile[];
  bName: string;
  isOwner: boolean;
  selectAll = false;
  selectStr = 'Select All';

  constructor(private http: HttpClient, private uploadService: HttpUploadService,
              private bService: BusinessService,
              private authService: AuthenticationService) { }
  ngOnInit() {
    this.bName = this.bService.currentBusiness.bName;
    if (this.bService.currentBusiness.bOwner.includes(this.authService.currentUserValue.email)) {
    this.isOwner = true;
    }
    this.receiveFiles();
    this.filesToDelete = new Array();
  }
  onFileSelected(event) {
    console.log(event);
    this.selectedFile = event.target.files[0] as File;
  }

  onUpload(event) {
    // const formData = new FormData();
    // formData.append('image', this.selectedFile, this.selectedFile.name);
    // this.uploadService.uploadAnImage(formData, this.bName);

    for (const file of event.files) {
      this.uploadedFiles.push(file);
      this.receiveFiles();
      // const formData = new FormData();
      // formData.append('image', file, file.name);
      // this.uploadService.uploadAnImage(formData, this.bService.currentBusiness.bName);
    }
  }

  receiveFiles() {
    (this.uploadService.getFiles(this.bName)).subscribe(
      data => {
        console.log(data, data.length);
        this.receivedFiles = data;
        console.table(this.receivedFiles);
      },
      error => {
        console.log('im here in error home component');
        console.log(typeof error);
      }
    );
  }

  deleteSelected() {
    for (const value of this.filesToDelete) {
     (this.uploadService.removeFile(value.id, value.fileOwner, value.fileName)).subscribe(
      data => {
        console.log(data, 'file deleted');
      },
      error => {
        console.log('im here in error delete files');
        console.log(typeof error);
      }
     );
    }
    this.receiveFiles();
  }

  chooseAll() {
    this.selectAll = !this.selectAll;
    this.selectStr = this.selectAll ? 'Unselect All' : 'Select All';
  }

  addRemoveFiles(file: IImageFile) {
    let index = -1;
    if (this.filesToDelete.length !== 0) {
      index = this.filesToDelete.findIndex((e) => e.id === file.id);
    }
    if (index === -1) {
      this.filesToDelete.push(file);
    } else {
      this.filesToDelete.splice(index, 1);
    }
  }


}

