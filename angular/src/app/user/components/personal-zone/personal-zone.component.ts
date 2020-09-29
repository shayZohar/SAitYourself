import { MatSnackBar } from "@angular/material";
import { HttpMessagesService } from "@/core/http/http-messages.service";
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked,
} from "@angular/core";
import { Router} from "@angular/router";
import { Observable, Subscription } from "rxjs";

import { HttpUserService } from "@/core/http/http-user.service";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { IUser } from "@/user/interfaces/iuser";
import { UserService } from "@/user/services/user.service";
import { BusinessService } from "@/business/services/business.service";
import { NavbarService } from "@/services/navbar.service";
import { HomeService } from "@/home/services/home.service";
import { IMessage } from "@/shared/interfaces/IMessage";

@Component({
  selector: "personal-zone",
  templateUrl: "./personal-zone.component.html",
  styleUrls: ["./personal-zone.component.scss"],
})
export class PersonalZoneComponent
  implements OnInit, AfterViewChecked, OnDestroy {
  @Input() user: IUser;
  display: boolean;
  messageText: string;
  showUsers: boolean;
  helpContent = "help";
  uTypes: string[] = [];
  show = { profile: false, messages: false, settings: false };
  currentShow = "profile";
  unredCount = 0;
  oldUnredCount = 0;
  private unredCountSub: Subscription;
  recivedInterval;
  resMessages: Observable<IMessage[]>;
  senMessages: Observable<IMessage[]>;

  constructor(
    private httpMessages: HttpMessagesService,
    private httpUser: HttpUserService,
    private userService: UserService,
    private authService: AuthenticationService,
    private businessService: BusinessService,
    private navbarService: NavbarService,
    private homeService: HomeService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this._init();
  }

  ngAfterViewChecked() {
    if (this.oldUnredCount !== this.unredCount) {
      // check if it change, tell CD update view
      this.oldUnredCount = this.unredCount;
      this.cdRef.detectChanges();
    }
  }

  /**
   * setting new currentUser type
   * @param type - the type to change to
   */
  changType(type: string) {
    this.authService.currentUserType = this.user.type = type;
    const links = localStorage.getItem("links");
    if (links && links === 'business') {
      this.businessService.init();
    }
  }

  _init() {
    this.user = this.authService.currentUserValue;
    this.getUserTypes();
    // getting messages for current user
    this.businessService.recieveMessages(this.user.email);
    this.recivedInterval = setInterval(() => {
      this.businessService.recieveMessages(this.user.email);
    }, 300000);
    this.businessService.sentMessages(this.user.email);
    // gettiing links for nav bar
    const links: string = localStorage.getItem("links");
    links === "business" && this.businessService.CurrentBusiness
      ? this.businessService.init()
      : this.homeService.init();
    this.unredCountSub = this.userService.userUnredCount.subscribe((data) => {
      this.unredCount = data;
    });
    // re-seting last view state
    this.currentShow = JSON.parse(localStorage.getItem("lastShow"));
    if (this.currentShow == null) {
      this.currentShow = "profile";
    }
    this.displayContent(this.currentShow);
  }

  /**
   * Gets user types from user service to local variabel
   */
  getUserTypes() {
    const self = this;
    this.httpUser.getUserTypes(this.user.email).subscribe((data) => {
      self.userService.setUserTypes(data);
      self.uTypes = self.userService.userTypes;
    });
  }

  /**
   * Shows edit user componnent as a dialog
   */
  showDialog() {
    this.display = true;
  }

  /**
   * Displays content for the component
   * @param type - the typr to display
   */
  displayContent(type: string) {
    this.show[this.currentShow] = false;
    this.currentShow = type;
    this.show[type] = true;
    if (type === "messages") {
      clearInterval(this.recivedInterval);
      this.resMessages = this.httpMessages.getRecievedMessages(this.user.email);
      this.recivedInterval = setInterval(() => {
        this.httpMessages.getRecievedMessages(this.user.email);
      }, 300000);
      this.senMessages = this.httpMessages.getSentMessages(this.user.email);
    }
    localStorage.setItem("lastShow", JSON.stringify(this.currentShow));
  }

  removeType(type: string) {
    const self = this;
    if (this.userService.userTypes.length === 1) {
      // no more types for user
      this.httpUser
        .httpDeleteUser(this.authService.currentUserValue.email)
        .subscribe(
          (data) => {
            // if secced then logOut and navegate to home
            self.authService.logout();
            self.router.navigate([""]);
          },
          (error) => {
            this.snackBar.open(error, "", { duration: 3000 });
          }
        );
    } else {
      // deleting current type
      this.httpUser
        .httpDeleteType(this.authService.currentUserValue.email, type)
        .then((data) => {
          if (data === true) {
            self.userService.removeType(type);
            self.uTypes = this.userService.userTypes;
            self.changType(this.userService.userTypes[0]);
          }
        })
        .catch((err) => {
          this.snackBar.open(err, "", { duration: 3000 });
        });
    }
  }

  /**
   * browsing to current business home page
   */
  goToSite() {
    if (
      this.businessService.currentBusiness !== undefined ||
      this.businessService.currentBusiness !== null
    ) {
      this.router.navigate(["/business"]);
    }
  }

  /**
   * Adds type to current user and to uTypes
   * @param typeToAdd - the new type to add
   */
  addType(typeToAdd: string) {
    if (!this.uTypes.includes(typeToAdd)) {
      const self = this;
      this.httpUser.httpAddType(this.user.email, typeToAdd).subscribe(
        data => {
          if ( data !=  null) {
            self.uTypes.push(typeToAdd);
            self.userService.setUserTypes(self.uTypes);
            self.uTypes = self.userService.userTypes;
          }
        },
        error => {
          this.snackBar.open(error, "", { duration: 3000 });
        }
      );
    }
  }

  ngOnDestroy() {
    this.unredCountSub.unsubscribe();
    clearInterval(this.recivedInterval);
  }
}
