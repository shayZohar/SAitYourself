import { MatSnackBar } from "@angular/material";
import { IUser, emptyUser, ERole } from "@/user/interfaces/iuser";
import { IBusiness } from "@/business/interfaces/IBusiness";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { Component, OnInit, EventEmitter } from "@angular/core";
import { INavLinks } from "@/shared/interfaces/inav-links";
import { navLinksList } from "@/home/nav-links";
import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { HomeService } from "@/home/services/home.service";
import { Router } from "@angular/router";
import { BusinessService } from "@/business/services/business.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  links: INavLinks[] = navLinksList;
  bArr: IBusiness[];
  settings = "SiteSettings";
  user: IUser = emptyUser();
  selected = "";
  startLogoAnim = false;

  constructor(
    private homeService: HomeService,
    private authService: AuthenticationService,
    private businessService: BusinessService,
    private httpBusiness: HttpBusinessService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.homeService.init();
    // animation of home page
    if (sessionStorage.getItem("anim")) {
      this.startLogoAnim = false;
    } else {
      this.startLogoAnim = true;
      sessionStorage.setItem("anim", "logoAnimated");
    }

    if (this.authService.currentUserValue != null) {
      this.getBusinessesForUser();
    } else {
      this.getUnregisterdBusinesses([]);
    }
  }
  /**
   * Getsred businesses for user
   */
  getBusinessesForUser() {
    const self = this;
    this.httpBusiness
      .getRegisteredBusinesses(this.authService.currentUserValue.email)
      .subscribe(
        (data) => {
          if (data !== null) {
            self.bArr = self.businessService.businessesList = data;
            self.getOwnedBusinesses(data);
          }
        },
        (error) => {
          self.snackBar.open(error, "", { duration: 3000 });
        }
      );
  }

  /**
   * Gets owned businesses and connect the two businesses arrays to one
   * @param myBusinesses  - business list with all of the businesses that the user is a client in
   */
  getOwnedBusinesses(myBusinesses: IBusiness[]) {
    const self = this;
    this.httpBusiness
      .getOwnerOwnedBusinesses(this.authService.currentUserValue.email)
      .subscribe(
        (data) => {
          if (data !== null) {
            data.forEach((element) => {
              myBusinesses = myBusinesses.filter(
                (b) => b.bName !== element.bName
              );
            });
            myBusinesses = myBusinesses.concat(data);
            self.bArr = self.businessService.businessesList = myBusinesses;
            self.getUnregisterdBusinesses(myBusinesses);
          }
        },
        (error) => {
          self.snackBar.open(error, "", { duration: 3000 });
        }
      );
  }

  /**
   * Gets all of businesses and filtered the regesterd businesses from it
   * @param myBusinesses businesses list with all registered businesses
   */
  getUnregisterdBusinesses(myBusinesses: IBusiness[]) {
    const self = this;
    const currentUser = this.authService.currentUserValue;
    const businessRtriveFuncToUs =
      currentUser != null
        ? this.httpBusiness.getAllBusinessesForClient(currentUser.email)
        : this.httpBusiness.getBusiness();
    businessRtriveFuncToUs.subscribe((data) => {
      myBusinesses.forEach((element) => {
        data = data.filter((z) => z.bName !== element.bName);
      });
      this.bArr = this.businessService.businessesList = data;
      self.businessService.haveBusinessesList = true;
    });
  }

  /**
   * Go to site - navigate to chosen business
   * @param business -business to navigate to
   */
  goToSite(business: IBusiness) {
    const currentBusiness = this.businessService.CurrentBusiness;
    if (
      currentBusiness &&
      currentBusiness.ownerConnected &&
      business.bOwner.includes(this.authService.currentUserValue.email) &&
      currentBusiness.bName !== business.bName
    ) {
      this.httpBusiness
        .httpUpdateBoolFields(false, currentBusiness.bName, "OwnerConnected")
        .subscribe();
    }
    this.businessService.changeCurrentBusiness(business);
    const currentUser = this.authService.currentUserValue;
    if (currentUser == null) {
      this.user.type = ERole.Unsigned;
      this.authService.currentUserValue = this.user;
    }
    this.router.navigate(["/business"]);
  }
}
