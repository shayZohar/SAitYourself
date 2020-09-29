import { MatSnackBar } from "@angular/material/snack-bar";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectorRef,
  AfterViewChecked,
} from "@angular/core";
import { Router } from "@angular/router";

import { HttpSignUpService } from "@/core/http/http-sign-up.service";
import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { ERole, emptyUser } from "@/user/interfaces/iuser";
import { UserService } from "@/user/services/user.service";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { BusinessService } from "@/business/services/business.service";
import { IBusiness, emptyBusiness } from "@/business/interfaces/IBusiness";
import { isUndefined } from "util";
import {
  IUserListSelection,
  userListSelection,
} from "@/shared/interfaces/iuser-list-selection";

@Component({
  selector: "owner-personal-zone",
  templateUrl: "./owner-personal-zone.component.html",
  styleUrls: ["./owner-personal-zone.component.scss"],
})
export class OwnerPersonalZoneComponent implements OnInit, AfterViewChecked {
  @Output() removeType = new EventEmitter<string>();
  showBusinesses = false;
  showChosenBusiness = false;
  previusShowChosenBusinessValue: boolean;
  newBusiness = emptyBusiness();
  showClients: boolean;
  showOwners: boolean;
  signNewBusiness = false;
  addOwnerForm = false;
  newOwnerEmail: string;
  signUpNewOwner = false;
  selection = userListSelection();
  showSelectedUser = false;
  clearBusiness = false;
  addBusinessBtn = "Add New Business";
  currentUser = emptyUser();

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private businessService: BusinessService,
    private httpBusiness: HttpBusinessService,
    private httpSignUp: HttpSignUpService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.getBusinesses();
    this.previusShowChosenBusinessValue = this.showChosenBusiness;
  }

  ngAfterViewChecked() {
    if (this.previusShowChosenBusinessValue !== this.showChosenBusiness) {
      // check if it change, tell CD update view
      this.previusShowChosenBusinessValue = this.showBusinesses;
      this.cdRef.detectChanges();
    }
  }

  /**
   * get all of the user's owned business
   */
  getBusinesses() {
    const self = this;
    this.httpBusiness.getOwnerOwnedBusinesses(this.currentUser.email).subscribe(
      (data) => {
        if (data !== null) {
          self.businessService.businessesList = data;
          self.showBusinesses = true;
        }
      },
      (error) => {
        this.snackBar.open(error, "", { duration: 3000 });
      }
    );
  }

  /**
   * Signs up new business for owner
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
          this.newBusiness = emptyBusiness();
        },
        (error) => {
          self.snackBar.open(error, "", { duration: 3000 });
        }
      );
    }
  }

  /**
   * Changes current business in service
   * @param business - the new business to set
   */
  changeCurrentBusiness(business: IBusiness) {
    // check if no business was selected
    const currentBusiness = this.businessService.CurrentBusiness;
    const changeLists =
      currentBusiness == null || business === undefined
        ? true
        : business.bName !== currentBusiness.bName;
    if (changeLists) {
      this.showChosenBusiness = false;
      const self = this;
      if (currentBusiness != null && currentBusiness.ownerConnected === true) {
        // disconnect business
        this.httpBusiness
          .httpUpdateBoolFields(
            false,
            this.businessService.CurrentBusiness.bName,
            "OwnerConnected"
          )
          .subscribe();
      }
      if (business !== undefined) {
        // disconnectData
        this.httpBusiness
          .httpUpdateBoolFields(true, business.bName, "OwnerConnected")
          .subscribe((data) => {
            if (data === false) {
              self.snackBar.open(
                "editing unavailable - another owner is connected",
                "",
                {
                  duration: 4000,
                }
              );
            }
            business.ownerConnected = data;
            this.businessService.changeCurrentBusiness(business);
            if (business !== undefined) {
              this.showChosenBusiness = true;
            }
            // check links for nav bar
            const links: string = localStorage.getItem("links");
            if (links === "business") {
              this.businessService.init();
            }
          });
      } else {
        // just dissconnecting
        this.businessService.changeCurrentBusiness(business);
      }
    } else if (
      business !== undefined &&
      business.bName === currentBusiness.bName
    ) {
      this.showChosenBusiness = true;
    }
  }

  /**
   * Closes current business display
   */
  closeDisplay() {
    this.changeCurrentBusiness(undefined);
    this.showChosenBusiness = false;
  }

  /**
   * Determines whether business have clients
   * @returns boolean if business have clients
   */
  haveClients(): boolean {
    return this.userService.checkClients();
  }

  /**
   * Determines whether business have owners
   * @returns boolean if business have owners
   */
  haveOwners(): boolean {
    return this.userService.checkOwners();
  }

  /**
   * Gets current business from business service
   * @returns business service current business
   */
  getCurrentBusiness(): IBusiness {
    return this.businessService.CurrentBusiness;
  }

  /**
   * Deletes a business for owner (if no more owners the business will be deleted)
   * @param business - the business to delete
   */
  deleteBusiness(business: IBusiness) {
    const self = this;
    this.httpBusiness
      .httpDeleteBusiness(
        this.currentUser.email,
        this.currentUser.type,
        business
      )
      .subscribe(
        (data) => {
          if (data === true) {
            // removing from business list
            self.businessService.removeFromBusinessList(business);
            // delete current business
            self.clearBusiness = true;
            self.changeCurrentBusiness(undefined);
            if (
              self.businessService.businessesList == null ||
              self.businessService.businessesList.length === 0
            ) {
              // emit type to remove
              self.removeType.emit(ERole.Business);
            }
          }
        },
        (error) => {
          self.snackBar.open(error, "", { duration: 3000 });
        }
      );
  }

  /**
   * Gets business array from business service
   * @returns business array from business list
   */
  getBusinessArray(): IBusiness[] {
    return this.businessService.businessesList;
  }

  /**
   * Removes a client from the business
   * @param clientToRemove - the email of the client to remove
   */
  removeClient(clientToRemove: string) {
    const self = this;
    this.httpBusiness
      .HttpRemoveClient(clientToRemove, this.businessService.CurrentBusiness)
      .then((data) => {
        if (data === true) {
          self.userService.removeFromeClientList(clientToRemove);
        }
      })
      .catch((err) => {
        self.snackBar.open(err, "", { duration: 3000 });
      });
  }

  /**
   * Blocks a client from business
   * @param clientToBlock - the email of the client to block
   */
  blockClient(clientToBlock: string) {
    const self = this;
    this.httpBusiness
      .HttpBlockClient(clientToBlock, this.businessService.CurrentBusiness)
      .subscribe(
        (data) => {
          if (data === true) {
            self.userService.addToBlockedList(clientToBlock);
          }
        },
        (error) => {
          self.snackBar.open(error, "", { duration: 3000 });
        }
      );
  }

  /**
   * Removes an owner from the business
   * @param ownerToRemove - the email of the owner to remove
   */
  removeOwner(ownerToRemove: string) {
    const self = this;
    this.httpBusiness
      .HttpRemoveOwner(ownerToRemove, this.businessService.CurrentBusiness)
      .subscribe(
        (data) => {
          if (data === true) {
            self.userService.removeFromeOwnersList(ownerToRemove);
          }
        },
        (error) => {
          self.snackBar.open(error, "", { duration: 3000 });
        }
      );
  }

  /**
   * unblocks a client from business
   * @param userToUnBlock - the email of the client to unblock
   */
  unBlockClient(userToUnblock: string) {
    const self = this;
    this.httpBusiness
      .httpUnBlockUser(userToUnblock, this.businessService.CurrentBusiness)
      .then((data) => {
        if (data === true) {
          self.userService.removeFromBlockedList(userToUnblock);
        }
      })
      .catch((error) => {
        self.snackBar.open(error, "", { duration: 3000 });
      });
  }

  /**
   * Determines whether current business is set
   * @returns boolean if current business is set or not
   */
  haveCurrentBusiness(): boolean {
    return !isUndefined(this.businessService.currentBusiness);
  }

  /**
   * Sets the user to show in user display and its display type
   * @param listSelection - the user and the display type
   */
  setUserToShow(listSelection: IUserListSelection) {
    this.selection = userListSelection(
      listSelection.selectedUser,
      listSelection.selectedType
    );
    this.showSelectedUser = true;
  }

  /**
   * incharge of add new business component visability and button
   */
  addNewBusiness() {
    if (this.addBusinessBtn === "Close") {
      this.newBusiness = emptyBusiness();
    }
    this.addBusinessBtn = this.signNewBusiness ? "Add New Business" : "Close";
    this.signNewBusiness = !this.signNewBusiness;
  }
}
