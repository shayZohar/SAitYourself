import { IImageFile } from "@/shared/interfaces/IImageFile";
import { HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Observable, throwError} from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class HttpUploadService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  /**
   * uploading an image to the server
   * @formdata - the data from front-end module including the files
   * @business - the business that own the image
   */
  uploadAnImage(formData: FormData, business: string) {
    const paramsObj = {
      bName: business
    };
    this.http
      .post("http://localhost:5000/api/Upload/file", formData, {
        reportProgress: true,
        observe: "events",
        params: paramsObj
      })
      .subscribe();
  }

  /**
   * get files path from server
   * @name - name of business own the files
   */
  getFiles(name: string): Observable<IImageFile[]> {
    const body = null;
    const paramsObj = {
      bName: name
    };
    return this.http
      .post<IImageFile[]>(
        "http://localhost:5000/api/Upload/GetBusinessImages",
        body,
        {
          params: paramsObj
        }
      )
      .pipe(
        map(response => {
          return response;
        }),
        catchError(response => {
          return throwError(response);
        })
      );
  }

  /**
   * removing file from system
   * @id - id of file
   * @owner - who own the file
   * @name - name of the file
   */
  removeFile(id: string, owner: string, name: string): Promise<string | any> {
    const body = null;
    const paramsObj = {
      bName: owner,
      fileName: name,
      fileId: id
    };
    return this.http
      .post<IImageFile[]>(
        "http://localhost:5000/api/Upload/DeleteImage",
        body,
        {
          params: paramsObj
        }
      )
      .pipe(
        map(response => {
          return response;
        }),
        catchError(response => {
          this.snackBar.open(response, "", {
            duration: 2000
          });
          return throwError(response);
        })
      )
      .toPromise();
  } // end of remove file
}
