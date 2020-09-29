import { BusinessService } from "@/business/services/business.service";
import { IBusiness } from "@/business/interfaces/IBusiness";
import { MatSnackBar } from "@angular/material";
import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthenticationService } from "@/core/authentication/authentication.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private businessService: BusinessService,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Determines whether user can activate a page by type
   * @param route - route of the page
   * @param state - state of route
   * @returns  boolean
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    let currentBusiness: IBusiness;
    let toBusiness: boolean;
    if (route.data.business) {
      // if trying to route to a page in a business
      currentBusiness = this.businessService.CurrentBusiness;
      toBusiness = route.data.business[0];
    }
    if (currentUser) {
      // check if route is restricted by role
      if (
        route.data.roles &&
        route.data.roles.indexOf(currentUser.type) !== -1 &&
        (!toBusiness || currentBusiness)
      ) {
        // authorised so return true
        return true;
      }
    }
    // if not authorised return false
    if (!currentBusiness && toBusiness) {
      this.snackBar.open(`no business selected`, "", {
        duration: 3000,
      });
    } else {
      this.snackBar.open(`You have no permission to enter this page`, "", {
        duration: 3000,
      });
    }
    // not logged in so redirect to home page with the return url
    this.router.navigate(["/home"]);
    return false;
  }
}
