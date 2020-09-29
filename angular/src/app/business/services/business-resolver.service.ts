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
  settings = "SiteSettings";
  constructor(
    private businassService: BusinessService,
    private httpBusiness: HttpBusinessService,
    private router: Router,
    private authService: AuthenticationService
  ) {}


  /**
   * business resolver service verify that current business
   *  if loaded before entering business nav
   * @param route
   * @param state
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IBusiness> | Promise<IBusiness> | IBusiness {
    const self = this;
    const currentBusiness = this.businassService.CurrentBusiness;
    if (currentBusiness != null) {
      return currentBusiness;
    } else {
      self.router.navigate(["/"]);
    }
  }
}
