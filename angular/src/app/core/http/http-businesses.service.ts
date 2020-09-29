import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ERole, IUser } from '@/user/interfaces/iuser';
import { IBusiness} from '@/business/interfaces/IBusiness';
import { Ihome } from '@/business/interfaces/ihome';
import { IAbout } from '@/business/interfaces/iAbout';
import { IAppointment } from '@/business/interfaces/iAppointment';
import { newBoolUpdate } from '@/shared/interfaces/i-bool-mongo-update';

@Injectable({
  providedIn: 'root'
})
export class HttpBusinessService {
  business: IBusiness[];
  currentBusiness: IBusiness;
  settings = "SiteSettings";
  constructor(
    private http: HttpClient
    ) {}


  /**
   * function to get all businesses from server
   * @returns business
   */
  getBusiness(): Observable<IBusiness[]> {
    const body = null;
    const paramsObj = {};
    return this.http
      .post<IBusiness[]>(
        'http://localhost:5000/api/Business/GetBusinesses',
        body,
        {
          params: paramsObj
        }
      )
      .pipe(
        map(response => {
          this.business = response;
          return response;
        }),
        catchError(response => {
          return throwError(response);
        })
      );
  }

  /**
   * Gets all businesses for client
   * @param userEmail - client email
   * @returns all businesses that available for client
   */
  getAllBusinessesForClient(userEmail: string): Observable<IBusiness[] | any> {
    const body = null;
    const paramsObj = {
      email: userEmail,
      type: ERole.User
    };
    return this.http
    .post<IBusiness[]>(
      'http://localhost:5000/api/Business/GetBusinesses',
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
   * getting business for businesses owner
   * @param businessOwnerEmail - email of business owner
   * @returns get owner businesses
   */
  httpGetOwnerBusinesses(businessOwnerEmail: string): Observable<IBusiness | any> {
    const self = this;
    const body = null;
    const paramsObj = {
      email: businessOwnerEmail,
      type: ERole.Business
    };
    this.currentBusiness = JSON.parse(localStorage.getItem(this.settings));
    if (this.currentBusiness) {
      return of (this.currentBusiness);
    }
    return this.http
      .post<IBusiness>(
        'http://localhost:5000/api/Business/GetBusinesses',
        body,
        {
          params: paramsObj
        }
      )
      .pipe(
        map(response => {
          ///////////////////////////////
          // setting current business
          //////////////////////////////
          return self.currentBusiness;
        }),
        catchError(response => {
          return throwError(response);
        })
      );
  }

  /**
   * updating business home page content by owner
   */
  updateHomePage(business: IBusiness): Observable<Ihome | any> {
    return this.http
      .post('http://localhost:5000/api/Business/updateBHome', business)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  /**
   * updating business about page content by owner
   */
  updateAboutPage(business: IBusiness): Observable<IAbout | any> {
    return this.http
      .post('http://localhost:5000/api/Business/updateBAbout', business)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  /**
   * Gets owned businesses
   * @param emailStr - theBusiness owner email
   * @returns owned businesses lisn of current owner
   */
  getOwnerOwnedBusinesses(emailStr: string): Observable<IBusiness[] | any> {
    const body = null;
    const paramsObj = {
      email: emailStr
    };
    return this.http
      .post<IBusiness[]>(
        'http://localhost:5000/api/business/getOwnersBusinesses',
        body,
        {
          params: paramsObj
        }
      )
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  /**
   * Gets registered businesses of current client
   * @param emailStr -the email of the client
   * @returns registered businesses array of current client
   */
  getRegisteredBusinesses(emailStr: string): Observable<IBusiness[] | any> {
    const body = null;
    const paramsObj = {
      email: emailStr
    };
    return this.http
      .post<IBusiness[]>(
        'http://localhost:5000/api/business/getUserBusinesses',
        body,
        {
          params: paramsObj
        }
      )
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }


  /**
   *  remove client from business
   * @param clientToRemove -client email
   * @param business - business to remove client from
   * @returns boolean if client removed or not
   */
  HttpRemoveClient(clientToRemove: string, business: IBusiness): Promise< boolean | any> {
    const self = this;
    const body = null;
    const paramsObj = {
      businessName: business.bName,
      client: clientToRemove
    };
    return this.http
      .post(
        'http://localhost:5000/api/business/removeClient',
        body,
        {
          params: paramsObj,
        },
      )
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      ).toPromise();
  }


  /**
   * Https un block user from business
   * @param userToUnBlock -user's email
   * @param business -business to unblock from
   * @returns boolean if user unblocked or not
   */
  httpUnBlockUser(userToUnBlock: string , business: IBusiness): Promise<boolean | any> {
    const body = null;
    const paramsObj = {
      businessName: business.bName,
      user: userToUnBlock
    };
    return this.http
      .post(
        'http://localhost:5000/api/business/unBlockUser',
        body,
        {
          params: paramsObj,
        },
      )
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      ).toPromise();
  }


  /**
   *  remove owner from business
   * @param ownerToRemove - owner's email
   * @param business - business to remove owner from
   * @returns boolean if user removed or not
   */
  HttpRemoveOwner(ownerToRemove: string, business: IBusiness): Observable< boolean | any> {
    const body = null;
    const paramsObj = {
      businessName: business.bName,
      owner: ownerToRemove
    };
    return this.http
      .post(
        'http://localhost:5000/api/business/removeOwner',
        body,
        {
          params: paramsObj,
        },
      )
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }


  /**
   * block user from business
   * @param clientToBlock -user's email
   * @param business -business to unblock from
   * @returns string if user blocked or not
   */
  HttpBlockClient(clientToBlock: string, business: IBusiness): Observable< string | any> {
    const body = null;
    const paramsObj = {
      businessName: business.bName,
      client: clientToBlock
    };
    return this.http
      .post(
        'http://localhost:5000/api/business/BlockClient',
        body,
        {
          params: paramsObj,
        },
      )
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }


  /**
   * check business name
   * @param name - name of business to check its already exists
   * @returns boolean if exists or not
   */
  httpCheckBusinessName(name: string): Observable< boolean | any> {
    const body = null;
    const paramsObj = {
      businessName: name,
    };
    return this.http
      .post(
        'http://localhost:5000/api/business/nameExists',
        body,
       { params: paramsObj}
      )
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  /**
   * check business email exists
   * @param email - email of business
   * @returns boolean if email of business already exists or not
   */
  httpCheckBusinessEmail(email: string): Observable< boolean | any> {
    const body = null;
    const paramsObj = {
      businessEmail: email,
    };
    return this.http
      .post(
        'http://localhost:5000/api/business/emailExists',
        body,
       { params: paramsObj}
      )
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }


  /**
   *  sign client to business
   * @param business - required business
   * @param client - client's email to sign-up
   * @returns signed client to business
   */
  httpSignClientToBusiness(business: string, client: string): Observable<IUser | any> {
    const body = null;
    const paramsObj = {
      businessName: business,
      newClient: client
    };
    return this.http.post('http://localhost:5000/api/Business/addNewClient', body, {params: paramsObj}).pipe(
      map(response => {
        return response;
      }),
      catchError(response => {
        return throwError(response);
      })
    );
  }

  /**
   * delete business
   * @param userEmail - user's email that perform the deleting
   * @param currentType - type of the user
   * @param business - business to delete
   * @returns boolean if delete business succeed
   */
  httpDeleteBusiness(userEmail: string, currentType: string, business: IBusiness): Observable<boolean | any> {
    const body = null;
    const paramsObj = {
      businessName: business.bName,
      user: userEmail,
      requestFrom: currentType
    };
    return this.http
    .post(
      'http://localhost:5000/api/business/deleteBusiness',
      body,
     {params: paramsObj}
    )
    .pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  /**
   * Sets apointment object of business
   * @param app - appointment to set
   * @returns updated appointment object
   */
  setApointments(app: IAppointment): Observable<IAppointment | any> {
    return this.http
      .post(
        'http://localhost:5000/api/business/SetAppointments', app
      )
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  /**
   * Gets appointment of business
   * @param bName - business name
   * @returns appointment
   */
  getAppointment(bName: string): Observable<IAppointment | any> {
    const body = null;
    const paramsObj = {
      name: bName
    };
    return this.http
      .post<IAppointment>(
        'http://localhost:5000/api/business/GetAppointment',
        body,
        {
          params: paramsObj
        }
      )
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  /**
   * update boolean fields for business in server
   * @param valueToUpdate - the wanted value of the field
   * @param businessNameToUpdate - the business to update the field in
   * @param field -the requested field to update
   * @returns boolean if was able to change or not
   */
  httpUpdateBoolFields(valueToUpdate: boolean, businessNameToUpdate: string, field: string): Observable<boolean | any> {
    const update = newBoolUpdate(valueToUpdate, businessNameToUpdate, field);
    return this.http
      .post(
        'http://localhost:5000/api/business/updateBoolFields',
       update
      )
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
}
