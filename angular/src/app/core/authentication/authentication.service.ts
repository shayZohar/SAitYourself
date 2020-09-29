import { HttpBusinessService } from '@/core/http/http-businesses.service';
import { UserService } from "@/user/services/user.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { IUser, ERole } from "@/user/interfaces/iuser";
import { Ihome } from "@/business/interfaces/ihome";
import { IBusiness } from "@/business/interfaces/IBusiness";
import { IfStmt } from "@angular/compiler";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;
  settings = "SiteSettings";

  constructor(
    private userSevice: UserService,
    private httpBusiness: HttpBusinessService,
    private http: HttpClient) {
    // will set to null before login
    // represents current user in system
    this.currentUserSubject = new BehaviorSubject<IUser>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // defines currentUserValue field in the service
  // used by . as a regular field
  /**
   * Gets current user value
   */
  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }

  /**
   * Sets current user value
   */
  public set currentUserValue(u: IUser) {
    if (u != null) {
      localStorage.setItem("currentUser", JSON.stringify(u));
      this.currentUserSubject.next(u);
    }
  }

  /**
   * Sets current user type
   */
  public set currentUserType(type: string) {
    this.currentUserSubject.value.type = type;
    this.currentUserValue = this.currentUserSubject.value;
  }

  /**
   * Gets current user type
   */
  public get currentUserType(): string {
    const user = this.currentUserSubject.value;
    if (user !== null) {
      return user.type;
    }
    return null;
  }
/**
 * Logs in user
 * @param emailStr - user's email
 * @param passStr -user's password
 * @returns  user if password is valid and email exists
 */
logInUser(emailStr: string, passStr: string): Observable<IUser | any> {
    const body = null;
    const paramsObj = {
      email: emailStr,
      pWord: passStr
    };
    return this.http
      .post<IUser>("http://localhost:5000/api/auth/GetByEmailPass", body, {
        params: paramsObj
      })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          return user;
        }),
        catchError(response => {
          return throwError(response);
        })
      );
  }

/**
 * Logs in user to business
 * @param emailStr - user's email
 * @param passStr -user's password
 * @param business - wanted business to logg-in to
 * @return user
 */
logInUserToBusiness(emailStr: string, passStr: string, business: string): Observable<IUser | any> {
    const body = null;
    const paramsObj = {
      email: emailStr,
      pWord: passStr,
      businessName: business
    };
    return this.http
      .post<IUser>("http://localhost:5000/api/auth/GetByEmailPass", body, {
        params: paramsObj
      })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          return user;
        }),
        catchError(response => {
          return throwError(response);
        })
      );
  }

  /**
   * Logouts authentication service
   */
  logout() {
    if (this.currentUserValue.type !== ERole.Unsigned) {
      // updating user's last seen field in server
      this.userSevice.updateLastSeen(this.currentUserValue.email);
    }
    const currentBusiness: IBusiness = JSON.parse(localStorage.getItem(this.settings));
    if (currentBusiness != null && currentBusiness.ownerConnected) {
      // if current business is in edit mode then change the field to not in edit mode
      this.httpBusiness.httpUpdateBoolFields(false, currentBusiness.bName, "OwnerConnected").subscribe();
    }
    localStorage.removeItem(this.settings);
    localStorage.removeItem('lastShow');
    sessionStorage.clear();

    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}
