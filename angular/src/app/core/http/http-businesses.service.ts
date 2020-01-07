import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IBusiness, emptyBusiness } from '@/business/interfaces/IBusiness';
import { IListDisplay } from './../../shared/interfaces/i-list-display';
import { Ihome } from '@/business/interfaces/ihome';
import { IAbout } from '@/business/interfaces/iAbout';

@Injectable({
  providedIn: 'root'
})
export class HttpBusinessService {
  business: IBusiness[];
  currentBusiness: IBusiness;

  constructor(private http: HttpClient) {}

  ////////////////////////////////////////////////
  // function to get all businesses from server
  ///////////////////////////////////////////////

  // press Ctrl+Alt+C twice

  /**
   * Gets business
   * @returns business
   */
  getBusiness(): Observable<IBusiness[]> {
    const body = null;
    const paramsObj = {};

    // AMIT fix: need to think on a better solution, it wil not be updated if we add a business
    if (this.business) {
      // tslint:disable-next-line: deprecation
      return of(this.business);
    }
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
          console.log(response);
          this.business = response;
          return response;
        }),
        catchError(response => {
          console.log('here in http-get-bussines error');
          console.log(response);
          return throwError(response);
        })
      );
  }

  // AMIT
  //////////////////////////////////////////////////////
  // getting all of this business for businesses owner
  //////////////////////////////////////////////////////

  getOwnerBusinesses(businessOwnerEmail: string): Observable<IBusiness> {
    const self = this;
    const body = null;
    const paramsObj = {
      email: businessOwnerEmail
    };
    if (this.currentBusiness) {
      // tslint:disable-next-line: deprecation
      return of(this.currentBusiness);
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
        map(businesses => {
          ///////////////////////////////
          // setting current business
          //////////////////////////////
          self.currentBusiness = businesses[0];
          console.log(businesses);
          return self.currentBusiness;
        }),
        catchError(response => {
          console.log('here in http-get-bussines error');
          return throwError(response);
        })
      );
  }
  // AMIT
  updateHomePage(business: IBusiness): Observable<Ihome | any> {
    return this.http
      .post('http://localhost:5000/api/Business/updateBHome', business)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return error;
        })
      );
  }

  updateAboutPage(business: IBusiness): Observable<IAbout | any> {
    return this.http
      .post('http://localhost:5000/api/Business/updateBAbout', business)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          return error;
        })
      );
  }

  /**
   * Gets owned businesses
   * @param emailStr - theBusiness owner email
   * @returns owned businesses lisn of current owner
   */
  getOwnedBusinesses(emailStr: string): Observable<IBusiness[] | any> {
    const body = null;
    const paramsObj = {
      email: emailStr
    };
    return this.http
      .post<IListDisplay[]>(
        'http://localhost:5000/api/business/getOwnersBusinesses',
        body,
        {
          params: paramsObj
        }
      )
      .pipe(
        map(response => {
          console.log(response);
          return response;
        }),
        catchError(error => {
          return error;
        })
      );
  }

  // AMIT

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
          console.log(response);
          return response;
        }),
        catchError(error => {
          return error;
        })
      );
  }
}
