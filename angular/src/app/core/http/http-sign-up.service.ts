import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IUser } from '@/user/interfaces/iuser';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IBusiness } from '@/business/interfaces/IBusiness';

@Injectable({
  providedIn: 'root'
})
export class HttpSignUpService {
  constructor(private http: HttpClient) {}

  /////////////////////////////////////////
  ///// signing up to system
  ////////////////////////////////////////

  signUp(user: IUser): Observable<string | any> {
    return this.http.post('http://localhost:5000/api/auth/register', user)
    .pipe(
      map(response => {
        console.log(response);
        return response;
      }),
      catchError(response => {
        console.log('error');
        return throwError(response);
      })
    );
  }

   /////////////////////////////////////////
  ///// signing business to system
  ////////////////////////////////////////
  signBusiness(business: IBusiness): Observable<string | any> {
    return this.http.post('http://localhost:5000/api/Business/register', business).pipe(
      map(response => {
        console.log(response);
        return response;
      }),
      catchError(response => {
        console.log('error signing business');
        return throwError(response);
      })
    );
  } // end of signBusiness
}
