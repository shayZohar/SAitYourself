import { ERole } from '@/user/interfaces/iuser';
import { MatSnackBar } from "@angular/material";
import { IBusiness } from "@/business/interfaces/IBusiness";
import { BusinessService } from "@/business/services/business.service";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { timingSafeEqual } from 'crypto';

@Injectable({
  providedIn: "root"
})
export class BusinessGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private businessService: BusinessService
  ) {}

  /**
   * Determines whether can activate by role in system / business
   * @param route - route of the page
   * @param state - state of route
   * @returns true if can navigate and a route if can not
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const business: IBusiness = JSON.parse(
      localStorage.getItem(this.businessService.settings)
    );
    const contact: boolean = route.data.contact;
    const appointment: boolean = route.data.appointment === true;
    const user = this.authService.currentUserValue;
    const isOwner =
      user != null  && user.type !== ERole.Unsigned ? business && business.bOwner.includes(user.email) : false;
    const isClient =
      user != null && user.type !== ERole.Unsigned ? business && business.bClient.includes(user.email) : false;
    if (business && user) {
      // connected user + currentBusiness
      if (contact != null) {
        // trying to enter contact
        if (((isOwner && business.ownerConnected ) || !isOwner )) {
          // if contact is true => trying to access messages, then must be an owner & connected to edit
          // if not connected => can access
          return true;
        }
      } else if (appointment) {
        // trying to enter appointment page
        if (business.bAppointment && user.token && (isClient || isOwner)) {
          // if connected user and aclient or an owner => can access
          return true;
        }
      } else {
        // not trying to access appointment page or contact page => can access
        return true;
      }
    }
    if (!business) {
      // no current business
      this.snackBar.open(
        "no business selected",
        "",
        {
          duration: 4000
        }
      );
      return this.router.navigate(["/home"]);
    }
    if (!isOwner && !isClient && user.type !== ERole.Admin) {
      // not registerd to the business
      this.snackBar.open(
        "Not Autherized! Sign-up / Login to enter this page",
        "",
        {
          duration: 4000
        }
      );
      return this.router.navigate(["/business/registration"]);
    }
    // registered
    this.snackBar.open("Not Autherized! Can not navigat to this page", "", {
      duration: 4000
    });
    return this.router.navigate(["/business"]);
  }
}
