import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { IUser, emptyUser } from '@/user/interfaces/iuser';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpUserService {
  constructor(private http: HttpClient) {}

  getUser(emailStr: string ): Observable<IUser | any> {
    const body = null;
    const paramsObj = {
      email: emailStr
    };
    return this.http
      .post('http://localhost:5000/api/user/GetByEmail', body, {
        params: paramsObj
      })
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



  /**
   * Gets users array from data base
   * @param emailArray an array of emails to find in users
   * @returns users array of all the users in the email array
   */
  // getUsersArray(emailArray: string[] ): Observable<IUser[] | any> {
  //   return this.http
  //     .post('http://localhost:5000/api/user/GetBusinessClients', emailArray
  //     )
  //     .pipe(
  //       map(response => {
  //         console.log(response);
  //         return response;
  //       }),
  //       catchError(response => {
  //         console.log('error');
  //         return throwError(response);
  //       })
  //     );

  // }


  // ///////////////////////////////////////////////
  // looking for user in database for log-in
  // ///////////////////////////////////////////////
  logInUser(emailStr: string , passStr: string): Observable<IUser | any> {
    const body = null;
    const paramsObj = {
      email: emailStr,
      pWord: passStr
    };
    return this.http
      .post('http://localhost:5000/api/auth/GetByEmailPass', body, {
        params: paramsObj
      })
      .pipe(
        map(response => {
          console.log(response);
          return response;
        }),
        catchError(response => {
          console.log(response);
          return throwError(response);
        })
      );
  }
  getUserTypes(emailStr: string): Observable<string[] | any> {
    const body = null;
    const paramsObj = {
      email: emailStr
    };
    return this.http.post(
      'http://localhost:5000/api/user/getUserTypes', body, { params: paramsObj }
    )
    .pipe(
      map( response => {

        return response;
      }),
      catchError( errorResponse => {

        return errorResponse;
      }),
    );
  }
  /**
   * Fined email
   * @param emailStr the email to check if exists in data base
   * @returns true if exsits and false if dos not exist
   */
  findEmail(emailStr: string): Observable<boolean | any> {
    const body = null;
    const paramsObj = {
      email: emailStr
    };
    return this.http.post(
      'http://localhost:5000/api/user/emailExists',
      body, { params: paramsObj
      })
      .pipe(
        map(response => {
          console.log(response);
          return response;
        }),
        catchError( response => {
          console.log(response);
          return response;
        })
      );
  }
}
