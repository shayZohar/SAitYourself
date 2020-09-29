import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { IUser, emptyUser, updateLastSeen } from "@/user/interfaces/iuser";

@Injectable({
  providedIn: "root"
})
export class HttpUserService {
  constructor(private http: HttpClient) {}

  /**
   * get user from server
   * @emailStr -  email of user
   */
  getUser(emailStr: string): Observable<IUser | any> {
    const body = null;
    const paramsObj = {
      email: emailStr
    };
    return this.http
      .post("http://localhost:5000/api/user/GetByEmail", body, {
        params: paramsObj
      })
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
   * get all users in the system
   */
  httpGetAllUsers(): Observable<IUser[] | any> {
    const body = null;
    const paramsObj = {};
    return this.http
      .post("http://localhost:5000/api/user/getAllUsers", body, {
        params: paramsObj
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(response => {
          return response;
        })
      );
  }

  /**
   * add owner to business
   * @param business - business to add owner to
   * @param ownerToAdd - owner email to add
   */
  httpAddOwner(business: string, ownerToAdd: string): Observable<IUser | any> {
    const self = this;
    const body = null;
    const paramsObj = {
      businessName: business,
      newOwner: ownerToAdd
    };
    return this.http
      .post("http://localhost:5000/api/business/AddNewOwner", body, {
        params: paramsObj
      })
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
   * add type to user
   * @param userEmail - email of user to add type to
   * @param typeToAdd - type to add to user
   */
  httpAddType(userEmail: string, typeToAdd: string): Observable<IUser | any> {
    const self = this;
    const body = null;
    const paramsObj = {
      email: userEmail,
      type: typeToAdd
    };
    return this.http
      .post("http://localhost:5000/api/user/addType", body, {
        params: paramsObj
      })
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
   * Gets users array from data base
   * @param emailArray an array of emails to find in users
   * @returns users array of all the users in the email array
   */
  httpGetClientsArray(business: string): Observable<IUser[] | any> {
    const body = null;
    const paramsObj = {
      businessName: business,
      mongoField: "BClient"
    };
    return this.http
      .post("http://localhost:5000/api/business/GetBusinessUsers", body, {
        params: paramsObj
      })
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
   * get list of blocked users from specific business
   * @param business - business of block list
   */
  httpGetBlockedArray(business: string): Observable<IUser[] | any> {
    const body = null;
    const paramsObj = {
      businessName: business,
      mongoField: "BBlockedList"
    };
    return this.http
      .post("http://localhost:5000/api/business/GetBusinessUsers", body, {
        params: paramsObj
      })
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
   * Gets business owners
   * @param businessName the name of the business to get owners
   * @returns owners array of users
   */
  httpGetOwnersArray(business: string): Observable<IUser[] | any> {
    const body = null;
    const paramsObj = {
      businessName: business,
      mongoField: "BOwner"
    };
    return this.http
      .post("http://localhost:5000/api/business/GetBusinessUsers", body, {
        params: paramsObj
      })
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
   * looking for user in database for log-in
   */
  logInUser(emailStr: string, passStr: string): Observable<IUser | any> {
    const body = null;
    const paramsObj = {
      email: emailStr,
      pWord: passStr
    };
    return this.http
      .post("http://localhost:5000/api/auth/GetByEmailPass", body, {
        params: paramsObj
      })
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
   * get type list of a user
   * @param emailStr - email of user
   */
  getUserTypes(emailStr: string): Observable<string[] | any> {
    const body = null;
    const paramsObj = {
      email: emailStr
    };
    return this.http
      .post("http://localhost:5000/api/user/getUserTypes", body, {
        params: paramsObj
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(errorResponse => {
          return errorResponse;
        })
      );
  }

  /**
   * delete type from list of types of user
   * @param user - user to delete type from
   * @param type - type to delete
   */
  httpDeleteType(user: string, type: string): Promise<boolean | any> {
    const body = null;
    const paramsObj = {
      userEmail: user,
      typeToDelete: type
    };
    return this.http
      .post("http://localhost:5000/api/user/deleteType", body, {
        params: paramsObj
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(response => {
          return response;
        })
      )
      .toPromise();
  }

  /**
   * Find email
   * @param emailStr the email to check if exists in data base
   * @returns true if exsits and false if dos not exist
   */
  findEmail(emailStr: string): Observable<boolean | any> {
    const body = null;
    const paramsObj = {
      email: emailStr
    };
    return this.http
      .post("http://localhost:5000/api/user/emailExists", body, {
        params: paramsObj
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(response => {
          return response;
        })
      );
  }

  /**
   * update user's last seen field in server
   * @param user - user's email to update
   */
  httpUpdateLastSeen(user: string): Observable<boolean | any> {
    const today = new Date();
    const updateLast = updateLastSeen(user, Date.parse(today + ''));
    return this.http
      .post("http://localhost:5000/api/user/updatedLastSeen", updateLast)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(response => {
          return response;
        })
      );
  }

  /**
   * delete user from system
   * @param email - email of user to delete
   */
  httpDeleteUser(email: string): Observable<boolean | any> {
    const body = null;
    const paramsObj = {
      userEmail: email
    };
    return this.http
      .post<boolean>("http://localhost:5000/api/user/deleteUser", body, { params: paramsObj})
      .pipe(
        map(response => {
          return response;
        }),
        catchError(response => {
          return response;
        })
      );
  }

  /**
   * update user in system
   * @param user - user to update
   */
  httpUpdateUser(user: IUser): Promise<boolean | any> {
    return this.http
      .post("http://localhost:5000/api/user/updateUser", user)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(response => {
          return throwError(response);
        })
      )
      .toPromise();
  }
}
