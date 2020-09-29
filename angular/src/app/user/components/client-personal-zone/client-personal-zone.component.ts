import { filter } from "rxjs/operators";
import { HttpSignUpService } from "@/core/http/http-sign-up.service";
import { MatSnackBar } from "@angular/material";
import { HomeService } from "@/home/services/home.service";
import { Router } from "@angular/router";
import { UserService } from "@/user/services/user.service";
import { BusinessService } from "@/business/services/business.service";
import { HttpBusinessService } from "@/core/http/http-businesses.service";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewChecked,
  ChangeDetectorRef,
} from "@angular/core";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { IBusiness, emptyBusiness } from "@/business/interfaces/IBusiness";
import { ERole, emptyUser } from "@/user/interfaces/iuser";

@Component({
  selector: "client-personal-zone",
  templateUrl: "./client-personal-zone.component.html",
  styleUrls: ["./client-personal-zone.component.scss"],
})
export class ClientPersonalZoneComponent implements OnInit, AfterViewChecked {
  @Output() removeType = new EventEmitter<string>();
  @Output() addType = new EventEmitter<string>();
  showClientBusinesses = false;
  showChosenBusiness = false;
  previusShowChosenBusinessValue: boolean;
  allBusinesses: IBusiness[];
  showAllBusinesses = false;
  currentUser = emptyUser();
  displayType: string;
  signNewBusiness = false;
  addBusinessBtn = "Create A Business";
  newBusiness = emptyBusiness();

  constructor(
    private authService: AuthenticationService,
    private httpBusiness: HttpBusinessService,
    private businessService: BusinessService,
    private homeService: HomeService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private httpSignUp: HttpSignUpService,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this._init();
  }

  _init() {
    this.currentUser = this.authService.currentUserValue;
    this.getBusinesses();
    this.previusShowChosenBusinessValue = this.showChosenBusiness;
  }

  ngAfterViewChecked() {
    if (this.previusShowChosenBusinessValue !== this.showChosenBusiness) {
      // check if it change, tell CD update view
      this.previusShowChosenBusinessValue = this.showChosenBusiness;
      this.cdRef.detectChanges();
    }
  }

  /**
   * Gets the client registered businesses from server
   */
  getBusinesses() {
    const self = this;
    this.httpBusiness.getRegisteredBusinesses(this.currentUser.email).subscribe(
      (data) => {
        if (data !== null) {
          self.businessService.businessesList = data;
          self.showClientBusinesses = true;
        }
      },
      (error) => {
        this.snackBar.open(error, "", { duration: 3000 });
      }
    );
  }

  /**
   * Gets business array from service
   * @returns registered business array
   */
  getBusinessArray(): IBusiness[] {
    return this.businessService.businessesList;
  }

  /**
   * Changes the current business
   * @param business - the business to set
   */
  changeCurrentBusiness(business: IBusiness) {
    // check if no business was selected
    const currentBusiness = this.businessService.CurrentBusiness;
    const changeLists =
      currentBusiness == null || business === undefined
        ? true
        : business.bName !== currentBusiness.bName;
    if (changeLists) {
       // need to change the business
      this.showChosenBusiness = false;
      this.businessService.changeCurrentBusiness(business);
      if (business !== undefined) {
        this.showChosenBusiness = true;
      }
      // check which nav bar needs to be inited
      const links: string = localStorage.getItem("links");
      if (links === "business") {
        links === "business" && this.businessService.CurrentBusiness
          ? this.businessService.init()
          : this.homeService.init();
      }
    } else if (
      business !== undefined &&
      business.bName === currentBusiness.bName &&
      !this.showChosenBusiness
    ) {
      this.showChosenBusiness = true;
    }
  }

  /**
   * getting the current business from business service
   * @returns current business from service
   */
  getCurrentBusiness(): IBusiness {
    return this.businessService.CurrentBusiness;
  }

  /**
   * unsubscrinbing from business
   * @param business - the business to unsubscribe from
   */
  deleteBusiness(business: IBusiness) {
    const self = this;
    this.httpBusiness
      .HttpRemoveClient(
        this.currentUser.email,
        this.businessService.CurrentBusiness
      )
      .then((data) => {
        if (data === true) {
          const currentBusiness: IBusiness = this.businessService
            .CurrentBusiness;
          if (currentBusiness != null) {
            self.businessService.removeFromBusinessList(currentBusiness);
          }
          self.changeCurrentBusiness(undefined);
          if (
            self.businessService.businessesList == null ||
            self.businessService.businessesList.length === 0
          ) {
            // emit type to remove
            self.removeType.emit(ERole.User);
          }
          self.closeDisplay(true);
        }
      })
      .catch((err) => {
        this.snackBar.open(err, "", { duration: 3000 });
      });
  }

  /**
   * Changes the current business
   * @param business - the new business to set
   * @param type - the display type for the business display
   */
  changeBusiness(business: IBusiness, type: string) {
    this.displayType = type;
    this.changeCurrentBusiness(business);
  }

  /**
   * Closes display of business
   * @param toClose - boolean if to close display
   */
  closeDisplay(toClose: boolean) {
    this.changeCurrentBusiness(undefined);
    this.showChosenBusiness = !toClose;
  }

  /**
   * Signs up new business for user (ERole.Business will be added to user types if needed)
   * @param business - the new business to sign-up
   */
  signUpNewBusiness(business: IBusiness) {
    if (business !== null) {
      business.bOwner.push(this.currentUser.email);
      const self = this;
      this.httpSignUp.signBusiness(business).subscribe(
        (data) => {
          self.snackBar.open("Your New Business Is Open", "", {
            duration: 3000,
          });
          self.businessService.addToBusinessesList(business);
          self.addNewBusiness();
          self.newBusiness = emptyBusiness();
          self.addType.emit("Business Owner");
        },
        (error) => {
          self.snackBar.open(error, "", { duration: 3000 });
        }
      );
    }
  }

  /**
   * incharge of add new business component visability and button
   */
  addNewBusiness() {
    if (this.addBusinessBtn === "Close") {
      this.newBusiness = emptyBusiness();
    }
    this.addBusinessBtn = this.signNewBusiness ? "Create A Business" : "Close";
    this.signNewBusiness = !this.signNewBusiness;
  }
}
