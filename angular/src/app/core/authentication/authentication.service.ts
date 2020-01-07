
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IUser } from '@/user/interfaces/iuser';
import { Ihome } from '@/business/interfaces/ihome';
import { IBusiness } from '@/business/interfaces/IBusiness';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;

  constructor(private http: HttpClient) {
    // console.log("USER ", localStorage.getItem("currentUser"));
    // will set to null before login
    // represents current user in system
    this.currentUserSubject = new BehaviorSubject<IUser>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // defines currentUserValue field in the service
  // used by . as a regular field
  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }
  public set currentUserValue(u: IUser) {
    if(u !== null){
      localStorage.setItem('currentUser', JSON.stringify(u));
      this.currentUserSubject.next(u);
    }
  }

  public set currentUserType(type: string) {
    this.currentUserSubject.value.type = type;
  }
  public get currentUserType(): string {
    return this.currentUserSubject.value.type;
  }
  ///////////////////////////////////////////////
  /// looking for user in database for log-in
  ///////////////////////////////////////////////
  logInUser(emailStr: string, passStr: string): Observable<IUser | any> {
    const body = null;
    const paramsObj = {
      email: emailStr,
      pWord: passStr
    };
    return this.http
      .post<IUser>('http://localhost:5000/api/auth/GetByEmailPass', body, {
        params: paramsObj
      })
      .pipe(
        map(user => {
          console.log(user);
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          return user;
        }),
        catchError(response => {
          console.log(response);
          return throwError(response);
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
