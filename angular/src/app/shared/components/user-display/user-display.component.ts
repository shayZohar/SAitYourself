import { IBusiness } from "@/business/interfaces/IBusiness";
import { MatSnackBar } from "@angular/material";
import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { HttpUserService } from "@/core/http/http-user.service";
import { BusinessService } from "@/business/services/business.service";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { emptyMessage } from "@/shared/interfaces/IMessage";
import { Router } from "@angular/router";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { EditUserComponent } from "@/shared/components/edit-user/edit-user.component";
import { IUser, ERole } from "@/user/interfaces/iuser";
import { NewMassageComponent } from "@/shared/components/new-massage/new-massage.component";
import { UserService } from "@/user/services/user.service";

@Component({
  selector: "user-display",
  templateUrl: "./user-display.component.html",
  styleUrls: ["./user-display.component.scss"],
})
export class UserDisplayComponent implements OnInit {
  @Output() remove = new EventEmitter<string>();
  @Output() block = new EventEmitter<string>();
  @Output() unBlock = new EventEmitter<string>();
  @Output() listIsSet = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<boolean>();
  // tslint:disable-next-line: no-input-rename
  @Input("showUser") user: IUser;
  @Input() type: string;
  ownerConnected: boolean;
  toShow: string[];
  lastSeenDate: string;
  birthDay: string;
  newMessage = emptyMessage();
  replacePassworedForm = false;
  eyeStatus = "password";
  verEyeStatus = "password";
  hours: any;
  minuts: any;
  sec: any;
  @Input() uTypes: string[] = [];
  constructor(
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private businessService: BusinessService,
    private httpBusiness: HttpBusinessService,
    private userService: UserService,
    private httpUser: HttpUserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.ownerConnected = this.isOwnerConnected();

    if (this.user.lastSeen !== 0) {
      // converting users last seen in to a string to show on html
      this.lastSeenDate = `${this.userService.tranlateDate(
        new Date(this.user.lastSeen)
      )}
      at ${this.userService.tranlateTime(new Date(this.user.lastSeen))}`;
    }
    // converting users birth day in to a string to show on html
    this.birthDay = this.userService.tranlateDate(new Date(this.user.bDay));
  }

  /**
   * Determines whether need to see option for owner connected in html display
   * @returns boolean if need to show options
   */
  isOwnerConnected() {
    return this.businessService.CurrentBusiness != null &&
      this.authService.currentUserType === ERole.Business
      ? this.businessService.CurrentBusiness.ownerConnected
      : true;
  }

  /**
   * prepering a new message for new message component
   */
  preperNewMessage() {
    const currentBusiness = this.businessService.CurrentBusiness;
    this.newMessage.date = this.userService.tranlateDate(new Date());
    const currentUser = this.authService.currentUserValue;
    this.newMessage.senderId =
      currentUser.type === ERole.Business &&
      currentBusiness !== null &&
      currentBusiness.bOwner.includes(currentUser.email)
        ? this.businessService.CurrentBusiness.bMail
        : currentUser.email;
    this.newMessage.recieverId = this.user.email;
  }

  /**
   * Opens edit user dialog
   */
  openEditUser(): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: "250px",
      data: this.user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // converting new birth-day after editing
      this.birthDay = `${this.userService.tranlateDate(
        new Date(this.user.bDay)
      )}`;
    });
  }

  /**
   * opening a new dialog to send a new message
   */
  openMessageDialog() {
    this.preperNewMessage();
    const dialogRef = this.dialog.open(NewMassageComponent, {
      width: "250px",
      data: this.newMessage,
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  /**
   * Gets user types from server
   */
  getUserTypes() {
    const self = this;
    this.httpUser.getUserTypes(this.user.email).subscribe((data) => {
      self.userService.setUserTypes(data);
      self.uTypes = self.userService.userTypes;
    });
  }

 /**
  * Changs the current user type according to the selected type
  * @param type - the type to change to
  */
 changType(type: string) {
    const currentBusiness = this.businessService.CurrentBusiness;
    if (
      this.user.type === ERole.Business &&
      type === ERole.User &&
      currentBusiness
    ) {
      // changeing from business owner to client
      this.changeToClient(currentBusiness);
    } else if (
      this.user.type === ERole.User &&
      type === ERole.Business &&
      currentBusiness
    ) {
      // change from client to owner
      this.changeToOwner(currentBusiness);
    } else {
      // admin or current Business is not selected so no need to change the status
      this.authService.currentUserType = this.user.type = type;
      this.ownerConnected = this.isOwnerConnected();
      const links = localStorage.getItem("links");
      if (links && links === "business") {
        this.businessService.init();
      }
    }
  }

  /**
   * Changes current user to client
   * @param currentBusiness - the current business to change to
   */
  changeToClient(currentBusiness: IBusiness) {
    const activeOwner =
      currentBusiness.bOwner.includes(this.user.email) &&
      currentBusiness.ownerConnected;
    if (activeOwner) {
      // need to release business
      this.httpBusiness
        .httpUpdateBoolFields(false, currentBusiness.bName, "OwnerConnected")
        .subscribe(
          (data) => {
            if (data) {
              currentBusiness.ownerConnected = false;
              this.businessService.changeCurrentBusiness(currentBusiness);
            }
          },
          (error) => {
            this.snackBar.open(error, "", { duration: 3000 });
          }
        );
    }
    this.authService.currentUserType = this.user.type = ERole.User;
    this.ownerConnected = this.isOwnerConnected();
    const links = localStorage.getItem("links");
    if (links && links === "business") {
      this.businessService.init();
    }
  }

  /**
   * Changes current user to owner
   * @param currentBusiness - the current business to change to
   */
  changeToOwner(currentBusiness: IBusiness) {
    const isOwner = currentBusiness.bOwner.includes(this.user.email);
    if (isOwner) {
      this.httpBusiness
        .httpUpdateBoolFields(true, currentBusiness.bName, "OwnerConnected")
        .subscribe(
          (data) => {
            if (!data) {
              this.snackBar.open(
                "editing unavailable - another owner is connected",
                "",
                { duration: 4000 }
              );
            }
            currentBusiness.ownerConnected = data;
            this.businessService.changeCurrentBusiness(currentBusiness);
          },
          (error) => {
            this.snackBar.open(error, "", { duration: 3000 });
          }
        );
    }
    this.authService.currentUserType = this.user.type = ERole.Business;
    this.ownerConnected = this.isOwnerConnected();
    const links = localStorage.getItem("links");
    if (links && links === "business") {
      this.businessService.init();
    }
  }

  /**
   * emiting the user to remove ( the user from display)
   * @param userToRemove - the email of the user to remove (the user on display)
   */
  removeUser(userToRemove: string) {
    this.remove.emit(userToRemove);
    this.closeDisplay();
  }

  /**
   * emiting client to block (the client on display)
   * @param clientToBlock - the email of the client to block (the client on display)
   */
  blockClient(clientToBlock: string) {
    this.block.emit(clientToBlock);
    this.closeDisplay();
  }

  /**
   * emiting the user to unblock (the user on display)
   * @param userToUnblock - the email of the user to unblock (the client on display)
   */
  unBlockUser(userToUnblock: string) {
    this.unBlock.emit(userToUnblock);
    this.closeDisplay();
  }

  /**
   * Closes user display
   */
  closeDisplay() {
    this.close.emit(true);
  }
}
