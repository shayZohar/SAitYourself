
import { IImageFile } from "@/shared/interfaces/IImageFile";
import { BusinessService } from "@/business/services/business.service";
import { HttpUploadService } from "@/core/http/http-upload.service";
import {
  Component,
  OnInit,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  HttpClient,
} from "@angular/common/http";
import { AuthenticationService } from "@/core/authentication/authentication.service";

@Component({
  selector: "sh-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"],
})
// tslint:disable-next-line: component-class-suffix
export class FileUpload implements OnInit {
  uploadedFiles: any[] = [];
  selectedFile: File = null;
  fileList: File[];
  receivedFiles: IImageFile[];
  filesToDelete: IImageFile[];
  bName: string;
  isOwner: boolean;
  selectAll = false;
  selectStr = "Select All";

  constructor(
    private http: HttpClient,
    private uploadService: HttpUploadService,
    private bService: BusinessService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    const currentBusiness = this.bService.CurrentBusiness;
    this.bName = currentBusiness.bName;
    // check if user is owner and can edit
    if (
      this.bService.currentBusiness.bOwner.includes(
        this.authService.currentUserValue.email
      ) &&
      currentBusiness.ownerConnected
    ) {
      this.isOwner = true;
    }
    // recieving files
    this.receiveFiles();
    this.filesToDelete = new Array();
  }

  /**
   * when selecting a file
   */
  onFileSelected(event) {
    this.selectedFile = event.target.files[0] as File;
  }

  /**
   * when pressing on upload button
   * @param event - event that accured with the file(s)
   */
  onUpload(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.receiveFiles();
    setTimeout(() => {
      this.uploadedFiles = [];
    }, 5000);
  }

  /**
   * recieving files path from server
   */
  receiveFiles() {
    this.uploadService.getFiles(this.bName).subscribe(
      (data) => {
        this.receivedFiles = data;
      },
      (error) => {
        this.snackBar.open(error, "", { duration: 3000 });
      }
    );
  }

  /**
   * delete selected files
   */
  deleteSelected() {
    if (this.selectAll) {
      this.filesToDelete = this.receivedFiles;
    }
    for (const value of this.filesToDelete) {
      this.uploadService
        .removeFile(value.id, value.fileOwner, value.fileName)
        .then((data) => {})
        .catch((error) => {
          this.snackBar.open(error, "", { duration: 3000 });
        })
        .finally(() => {
          this.receiveFiles();
        });
    }
  }

  /**
   * when pressing on select-all files button
   */
  chooseAll() {
    this.selectAll = this.selectStr === "Select All" ? true : false;
    this.selectStr = this.selectAll ? "Unselect All" : "Select All";
    if (this.selectAll) {
      this.filesToDelete = JSON.parse(JSON.stringify(this.receivedFiles));
    }
  }

  /**
   * when selecting\deselecting file(s) to delete
   */
  addRemoveFiles(file: IImageFile) {
    if (this.selectAll && this.selectStr === "Unselect All") {
      this.selectStr = "Select All";
    }
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
