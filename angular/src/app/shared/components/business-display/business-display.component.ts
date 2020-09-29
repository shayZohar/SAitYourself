import { MatSnackBar } from "@angular/material";
import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { HttpUserService } from "@/core/http/http-user.service";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { BusinessService } from "@/business/services/business.service";
import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
} from "@angular/core";

import { IUser, ERole } from "@/user/interfaces/iuser";
import { IBusiness } from "@/business/interfaces/IBusiness";
import { UserService } from "@/user/services/user.service";
import { Router } from "@angular/router";
import {
  IUserListSelection,
  userListSelection,
} from "@/shared/interfaces/iuser-list-selection";

@Component({
  selector: "business-display",
  templateUrl: "./business-display.component.html",
  styleUrls: ["./business-display.component.scss"],
})
export class BusinessDisplayComponent implements OnInit {
  @Input() business: IBusiness;
  @Input() type: string;


  showDetails: false;

  showOwners: boolean;
  selectedOwner: IUser;
  filteredOwnersArray: IUser[];

  showClients: boolean;
  selectedClient: IUser;
  filteredClientsArray: IUser[];

  showBlocked: boolean;
  selectedBloced: IUser;
  filteredBolckedArray: IUser[];

  addOwnerButton = "Add Owner";

  @Output() userToShow = new EventEmitter<IUserListSelection>();
  @Output() deleteBusiness = new EventEmitter<IBusiness>();
  @Output() remove = new EventEmitter<IUser>();
  @Output() browse = new EventEmitter();
  @Output() close = new EventEmitter<boolean>();
  appComponent: boolean;
  gallery: boolean;

  changeAppStatus = false;
  changeGlleryStatus = false;

  addOwner = false;
  disableGalApp = true;

  ownersCount = 0;
  clientCount = 0;
  blockedClientCount = 0;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private httpUser: HttpUserService,
    private businessService: BusinessService,
    private httpBusiness: HttpBusinessService,
    private snackBar: MatSnackBar,
    private router: Router // private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this._init();
  }

  /**
   * Inits business display componant
   */
  _init() {
    // disable edditing gallery and schedular settings
    if (this.business) {
      this.disableGalApp = !this.business.ownerConnected;
    }
    if (this.type !== ERole.User) {
      this.appComponent =
        this.business.bAppointment !== undefined
          ? this.business.bAppointment
          : false;
      this.gallery =
        this.business.bGallery !== undefined ? this.business.bGallery : false;
      this.showOwners = this.showClients = this.showBlocked = false;
      if (this.type !== ERole.User && this.type !== "All") {
        this.getClientsArray();
        this.getOwnersArray();
        this.getBlockedArray();
      }
    }
  }

  /**
   * Gets business clients array of business
   */
  getClientsArray() {
    const self = this;
    this.userService.haveClients = this.showClients = false;
    this.httpUser.httpGetClientsArray(this.business.bName).subscribe(
      (data) => {
        self.userService.currentClients = data;
        self.clientCount = self.userService.currentClients.length;

        self.userService.haveClients = self.showClients = true;
      },
      (error) => {
        self.snackBar.open(error, "", { duration: 3000 });
      }
    );
  }

  /**
   * Gets blocked array of business
   */
  getBlockedArray() {
    const self = this;
    this.userService.haveBlocked = this.showBlocked = false;
    this.httpUser.httpGetBlockedArray(this.business.bName).subscribe(
      (data) => {
        self.userService.currentBlocked = data;
        self.blockedClientCount = self.userService.currentBlocked.length;
        self.userService.haveBlocked = self.showBlocked = true;
      },
      (error) => {
        self.snackBar.open(error, "", { duration: 3000 });
      }
    );
  }

  /**
   * Gets owners array of business
   */
  getOwnersArray() {
    const self = this;
    this.userService.haveOwners = this.showOwners = false;
    this.httpUser.httpGetOwnersArray(this.business.bName).subscribe(
      (data) => {
        self.userService.currentOwners = data.filter(
          (u) => u.email != self.authService.currentUserValue.email
        );
        self.ownersCount = self.userService.currentOwners.length + 1;
        self.userService.haveOwners = self.showOwners = true;
      },
      (error) => {
        self.snackBar.open(error, "", { duration: 3000 });
      }
    );
  }

  /**
   * Changes add owner button (for add owner component)
   */
  changeAddOwnerButton() {
    if (this.addOwner) {
      // open add owner form
      this.addOwnerButton = "Add Owner";
    } else {
      this.addOwnerButton = "Close";
    }
    this.addOwner = !this.addOwner;
  }

  /**
   * Determines whether user is business owner
   * @returns true if user is business owner
   */
  isBusinessOwner(): boolean {
    return (
      this.authService.currentUserType === ERole.Business &&
      this.business.ownerConnected === true
    );
  }

  /**
   * Gets users array from service
   * @param listTypeToGet - list type to get
   * @returns requested array of users
   */
  getUsersArray(listTypeToGet: string): IUser[] {
    if (listTypeToGet === ERole.User) {
      if (this.userService.haveClients) {
        return this.userService.currentClients;
      }
    } else if (listTypeToGet === ERole.Business) {
      if (this.userService.haveOwners) {
        return this.userService.currentOwners;
      }
    } else if (listTypeToGet === "Blocked") {
      if (this.userService.haveBlocked) {
        return this.userService.currentBlocked;
      }
    }
  }

  /**
   * Determines whether have owners list in service
   * @returns true if have owners list
   */
  haveOwners(): boolean {
    const haveOwners = this.userService.checkOwners();
    if (!haveOwners) {
      this.ownersCount = 1;
    }
    return haveOwners;
  }

  /**
   * Determines whether have blocked list in service
   * @returns true if have blocked list
   */
  haveBlocked(): boolean {
    const haveBlocked = this.userService.checkBlocked();
    if (!haveBlocked) {
      this.blockedClientCount = 0;
    }
    return haveBlocked;
  }

  /**
   * Determines whether have clients list in service
   * @returns true if have clients list
   */
  haveClients(): boolean {
    const haveClients = this.userService.checkClients();
    if (!haveClients) {
      this.clientCount = 0;
    }
    return  haveClients;
  }

  /**
   * emiting the selected user to the father component
   * @param user - the selected user
   * @param type - the user type in the business
   */
  selected(user: IUser, type: string) {
    this.userToShow.emit(userListSelection(user, type));
  }

  /**
   * Saves app and gal status
   */
  saveAppAndGal() {
    if (this.appComponent !== this.business.bAppointment) {
      this.saveChange(this.appComponent, this.business.bName, "BAppointment");
    }
    if (this.gallery !== this.business.bGallery) {
      this.saveChange(this.gallery, this.business.bName, "BGallery");
    }
  }


  /**
   * Saves change in data base
   * @param value - boolean value
   * @param businessName - the business name that need to be changed
   * @param filed - the field to change
   */
  saveChange(value: boolean, businessName: string, filed: string) {
    const self = this;
    this.httpBusiness
      .httpUpdateBoolFields(value, businessName, filed)
      .subscribe(
        (data) => {
          if (data === true) {
            if (filed === "BAppointment") {
              self.business.bAppointment = self.appComponent;
              self.closeEdit("Appointment");
              this.snackBar.open(`scedual status: ${self.business.bAppointment}`, "", { duration: 2000 });
            } else if (filed === "BGallery") {
              self.business.bGallery = self.gallery;
              self.closeEdit("Gallery");
              this.snackBar.open(`gallery status: ${self.business.bGallery}`, "", { duration: 2000 });
            }
            this.businessService.changeCurrentBusiness(self.business);
            const links: string = localStorage.getItem('links');
            if (links === 'business') {
              // nav bar if a business nav bar, so updating the changes
              this.businessService.init();
            }
          }
        },
        (error) => {
          this.snackBar.open(error, "", { duration: 3000 });
        }
      );
  }

  /**
   * Closes edit off appointment and gallery
   * @param whatToClose - the field to close
   */
  closeEdit(whatToClose: string) {
    if (whatToClose === "Appointment") {
      this.changeAppStatus = false;
    } else if (whatToClose === "Gallery") {
      this.changeGlleryStatus = false;
    }
  }

  /**
   * Closes business display
   */
  closeDisplay() {
    this.close.emit(true);
  }

  /**
   * description: fucntion for adding owner to view
   * @param added - true if addded succesfully, false otherwise
   */
  ownerAdded(added: boolean) {
    this.addOwner = !added;
    if (added) {
      this.ownersCount++;
    }
    this.addOwnerButton = "Add Owner";
  }
}
