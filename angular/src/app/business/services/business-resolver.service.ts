import { catchError } from 'rxjs/operators';
import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { Injectable } from "@angular/core";
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";

import { AuthenticationService } from "@/core/authentication/authentication.service";
import { BusinessService } from "./business.service";
import { IBusiness } from "@/business/interfaces/IBusiness";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class BusinessResolverService implements Resolve<IBusiness> {
  constructor(
    private httpBusiness: HttpBusinessService,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IBusiness> | Promise<IBusiness> | IBusiness {
    const self = this;
    const currentUser = this.authService.currentUserValue;
    // AMIT: WORK need to finish resolver
    return this.httpBusiness.getOwnerBusinesses(currentUser.email)
    .pipe(
      map( response => {
        if (response) {
          console.log(response);
          // self.bService.currentBusiness = response;
          return response;
        } else {
          self.router.navigate(["/registration"]);
          return null;
        }
      }),
      catchError( errorRespons => {
        console.log(errorRespons);
        return errorRespons;
      })
    );
  }
}
