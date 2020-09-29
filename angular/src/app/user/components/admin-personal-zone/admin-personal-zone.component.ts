import { HomeService } from "@/home/services/home.service";
import { HttpSignUpService } from "@/core/http/http-sign-up.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { IBusiness } from "@/business/interfaces/IBusiness";
import { IUser, ERole } from "@/user/interfaces/iuser";
import { HttpUserService } from "@/core/http/http-user.service";
import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { BusinessService } from "@/business/services/business.service";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewChecked,
} from "@angular/core";
import { UserService } from "@/user/services/user.service";
import { Console } from "@angular/core/src/console";
import {
  userListSelection,
  IUserListSelection,
} from "@/shared/interfaces/iuser-list-selection";

@Component({
  selector: "admin-personal-zone",
  templateUrl: "./admin-personal-zone.component.html",
  styleUrls: ["./admin-personal-zone.component.scss"],
})
export class AdminPersonalZoneComponent implements OnInit, AfterViewChecked {
  @Output() removeType = new EventEmitter<string>();
  showBusinesses = false;
  showChosenBusiness = false;
  previusShowChosenBusinessValue: boolean;
  showUsers = false;
  addAdminForm = false;
  signUpNewAdmin = false;
  usersCount = 0;
  businessesCount = 0;
  selection = userListSelection();
  showSelectedUser = false;
  constructor(
    private authService: AuthenticationService,
    private businessService: BusinessService,
    private httpBusiness: HttpBusinessService,
    private homeService: HomeService,
    private userService: UserService,
    private httpUser: HttpUserService,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private httpSingUp: HttpSignUpService
  ) {}

  ngOnInit() {
    this._init();
  }

  ngAfterViewChecked() {
    if (this.previusShowChosenBusinessValue !== this.showChosenBusiness) {
      // check if it change, tell CD update view
      this.previusShowChosenBusinessValue = this.showChosenBusiness;
      this.cdRef.detectChanges();
    }
  }
  _init() {
    this.getBusinesses();
    this.getUsers();
    this.previusShowChosenBusinessValue = this.showChosenBusiness;
  }

  /**
   * Gets all of SAitYourself businesses from database
   */
  getBusinesses() {
    const self = this;
    this.httpBusiness.getBusiness().subscribe(
      (data) => {
        if (data !== null) {
          self.businessService.businessesList = data;
          self.businessesCount = data.length;
          self.showBusinesses = true;
        }
      },
      (error) => {
        self.snackBar.open(error, "", { duration: 3000 });
      }
    );
  }

  /**
   * @returns current business frome service
   */
  getCurrentBusiness(): IBusiness {
    return this.businessService.CurrentBusiness;
  }

  /**
   * Gets all of SAitYourself users from database
   */
  getUsers() {
    const self = this;
    this.httpUser.httpGetAllUsers().subscribe(
      (data) => {
        if (data !== null) {
          self.userService.allUsers = data;
          self.usersCount = data.length;
          self.showUsers = this.userService.haveAllUsers = true;
        }
      },
      (error) => {
        self.snackBar.open(error, "", { duration: 3000 });
      }
    );
  }

  /**
   * Gets business array from business service
   * @returns  - business array that is saved in business service
   */
  getBusinessArray() {
    const list = this.businessService.businessesList;
    if (list !== undefined && list != null) {
      return list;
    }
  }

  /**
   * Gets users array from user service
   * @returns  - users array that is saved in user service
   */
  getUsersArray(type: string): IUser[] {
    let list: IUser[];
    if (type === "All") {
      list = this.userService.allUsers;
      if (list !== undefined && list !== null) {
        return list;
      }
    }
  }

  /**
   * Checks if all users array exists in service
   * @returns boolean if all users array exists in users service
   */
  checkAllUsers(): boolean {
    const haveUsers = this.userService.checkAllUsers();
    if (!haveUsers) {
      this.usersCount = 0;
    }
    return haveUsers;
  }

  /**
   * Sets the user role to show in users display
   * @param listSelection - the user and the requested type to show
   */
  setUserToShow(listSelection: IUserListSelection) {
    const type =
      listSelection.selectedType !== ERole.Admin
        ? "All"
        : listSelection.selectedType;

    this.selection = userListSelection(listSelection.selectedUser, type);
    this.showSelectedUser = true;
  }

  /**
   * Sets user to show from selection in business display and gets all of his listed types
   * @param listSelection the user to find and his type
   */
  setUserFromBusinessToShow(listSelection: IUserListSelection) {
    const user = listSelection.selectedUser;
    listSelection.selectedUser = this.userService.allUsers.find(
      (u) => u.email === user.email
    );
    this.setUserToShow(listSelection);
  }

  /**
   * Deletes a business from server
   * @param business - the business to delete
   */
  deleteBusiness(business: IBusiness) {
    const self = this;
    const currentUser = this.authService.currentUserValue;
    this.httpBusiness
      .httpDeleteBusiness(currentUser.email, currentUser.type, business)
      .subscribe(
        (data) => {
          if (data === true) {
            // removing from business list
            self.businessService.removeFromBusinessList(business);
            this.businessesCount = this.businessService.businessesList.length;
            // delete current business
            self.changeBusiness(undefined);
            this.snackBar.open(`${business.bName} was deleted from system`);
            if (self.businessService.haveBusinessesList == null) {
              this.showBusinesses = false;
            }
          }
        },
        (error) => {
          self.snackBar.open(error, "", { duration: 3000 });
        }
      );
  }

  /**
   * Changes the current business
   * @param business - the business to set
   */
  changeBusiness(business: IBusiness) {
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
      business.bName === currentBusiness.bName
    ) {
      this.showChosenBusiness = true;
    }
  }

  /**
   *  setting user to show from admin personal zone component
   * @param user - the user to display
   * @param type - this user type
   */
  selected(user: IUser, type: string) {
    user = this.userService.allUsers.find(
      (u) => u.email === user.email
    );
    const select = userListSelection(user, type);
    this.setUserToShow(select);
  }

  /**
   * Removes user from server
   * @param userToRemove - the email of the user to remove
   */
  removeUser(userToRemove: string) {
    const self = this;
    this.httpUser.httpDeleteUser(userToRemove).subscribe(
      (data) => {
        if (data === true) {
          self.userService.removeFromAllUserstList(userToRemove);
          this.usersCount = this.userService.allUsers.length;
        }
      },
      (error) => {
        self.snackBar.open(error, "", { duration: 3000 });
      }
    );
  }

  /**
   * Closes display of the business
   * @param toClose - boolean value
   */
  closeDisplay(toClose: boolean) {
    this.showChosenBusiness = !toClose;
    this.businessService.changeCurrentBusiness(undefined);
  }
}
