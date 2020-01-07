import { IImageFile } from './../../shared/interfaces/IImageFile';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IBusiness, emptyBusiness } from '@/business/interfaces/IBusiness';
import { IListDisplay } from './../../shared/interfaces/i-list-display';
import { Ihome } from '@/business/interfaces/ihome';
import { IAbout } from '@/business/interfaces/iAbout';
@Injectable({
  providedIn: 'root'
})
export class HttpUploadService {


constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

uploadAnImage(formData: FormData, business: string) {
  const paramsObj = {
    bName: business
  };
  this.http.post('http://localhost:5000/api/Upload/file', formData, {
     reportProgress: true,
     observe: 'events',
     params: paramsObj
    })
    .subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + '%');
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
      }
    });
}
getFiles(name: string): Observable<IImageFile[] > {
  const body = null;
  const paramsObj = {
    bName: name
  };
  return this.http
    .post<IImageFile[]>('http://localhost:5000/api/Upload/GetBusinessImages', body, {
      params: paramsObj
    })
    .pipe(
      map(response => {
        console.log(name);
        console.log('Files recieved : ' + response);
        this.snackBar.open('Gallery refreshed\n' + response.length + ' files in gellery!', '', {
          duration: 20000
        });
        return  response;
      }),
      catchError(response => {
        console.log('error');
        return throwError(response);
      })
    );
}

/////////////////////////////////////////
  ///// removing message from server
  ////////////////////////////////////////
  removeFile(id: string, owner: string, name: string): Observable<string | any> {
    const body = null;
    const paramsObj = {
      bName: owner,
      fileName: name,
      fileId: id
    };
    return this.http
      .post<IImageFile[]>('http://localhost:5000/api/Upload/DeleteImage', body, {
        params: paramsObj})
      .pipe(
        map(response => {
          this.snackBar.open('files removed successfuly', '', {
            duration: 20000
          });
          return response;
        }),
        catchError(response => {
          console.log('error deleting imagefile');
          return throwError(response);
        })
      );
  } // end of reoveMessage

}
