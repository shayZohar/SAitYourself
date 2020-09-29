import { UserService } from "@/user/services/user.service";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  ChangeDetectorRef,
  AfterViewChecked,
  OnChanges,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { HttpSignUpService } from "@/core/http/http-sign-up.service";
import { HttpUserService } from "@/core/http/http-user.service";
import { IUser, emptyUser, ERole } from "@/user/interfaces/iuser";
import { IBusiness, emptyBusiness } from "@/business/interfaces/IBusiness";
import { BusinessService } from "@/business/services/business.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "sh-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent
  implements OnInit, AfterContentInit {
  business: IBusiness = emptyBusiness();
  user: IUser = emptyUser();
  birthDay: string;
  @Input() userTypes: string[] = [];
  @Input() businesses: IBusiness[] = [];
  @Output() signUp = new EventEmitter<IUser>();
  @Output() signBusiness = new EventEmitter<IBusiness>();
  @Output() signClient = new EventEmitter<IBusiness>();
  @Output() addUser = new EventEmitter<string>();
  selectedBusiness: IBusiness;
  approveBusinessSign: boolean;
  emailsNotEqual: boolean;
  eyeStatus = "password";
  verEyeStatus = "password";

  constructor(
    private userService: UserService,
    private httpUser: HttpUserService,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private businessService: BusinessService
  ) {}

  ngOnInit() {
    if (this.userTypes.length === 1) {
      this.user.type = this.userTypes[0];
    } else {
      this.user.type = ERole.User;
    }
  }

  /**
   * after content init if businesses list is undafined and a user is signing-up
   * then get list from business service
   */
  ngAfterContentInit() {
    if (this.user.type === ERole.User && this.businesses === undefined) {
      this.businesses = this.businessService.businessesList;
    }
  }


  /**
   * reacting to user submiting to system
   */
  onSubmit() {
    this.checkExistance(this.user.email);
  }

  /**
   * Determines whether current user is business owner
   * @returns boolean if business owner or not
   */
  isBusinessOwner(): boolean {
    const currntUserType = this.authService.currentUserType;
    return currntUserType !== null && currntUserType === ERole.Business;
  }

  /**
   * Checks if user selection is a client client
   * @returns boolean if selection is a client
   */
  checkClient(): boolean {
    if (this.user.type !== ERole.User) {
      return true;
    }
    return this.selectedBusiness === undefined;
  }

  /**
   * getting current business name
   * @returns the name of the current business
   */
  businessName(): string {
    const currentBusiness = this.businessService.CurrentBusiness;
    if (currentBusiness !== null) {
      return currentBusiness.bName;
    }
    return null;
  }


  /**
   * Cmethod to check if email is alredy in system
   * @param email - the email to check
   */
  checkExistance(email: string) {
    const self = this;
    this.httpUser.findEmail(email).subscribe(
      (data) => {
        if (data === true) {
          ////////////////////////////////////////////
          // found a user with this email
          ///////////////////////////////////////////
          this.snackBar.open("Email already exist in system", "", {
            duration: 3000,
          });
          self.user.email = "";
        } else {
          /////////////////////////////////////////////
          // the email is not in system
          ////////////////////////////////////////////

          // setting birth Day
          self.user.bDay = self.userService.setBirthDay(self.birthDay);
          if (self.user.type === ERole.Business) {
            // signing a new Business Owner
            if (self.business !== emptyBusiness()) {
              const currentBusiness = this.businessService.CurrentBusiness;
              const inBusinessSystem =
                currentBusiness && currentBusiness.bName === self.business.bName &&
                (currentBusiness.bOwner.includes(email) ||
                  currentBusiness.bClient.includes(email));
              if (inBusinessSystem) {
                self.snackBar.open(
                  "error, user already registerd to business as owner / client",
                  "",
                  {
                    duration: 3000,
                  }
                );
                self.user.email = "";
              } else {
              // creating a new business
              self.business.bOwner.push(self.user.email);
              self.signBusiness.emit(self.business);
              }
            }
          } else if (self.user.type === ERole.User) {
            self.business.bClient.push(self.user.email);
            self.signClient.emit(self.business);
          }
          self.signUp.emit(self.user);
          self.snackBar.open("Thank you", "", { duration: 3000 });
        }
      },
      (error) => {
        self.snackBar.open(error, "", { duration: 3000 });
      }
    );
  }



  /**
   * Displays the bName property from the selected business
   * @param business - the selected business
   * @returns business name
   */
  public displayProperty(business: IBusiness) {
    if (business) {
      return business.bName;
    }
  }

  /**
   * Clears business and sets it to empty business
   */
  clearBusiness() {
    this.business = emptyBusiness();
  }
}
