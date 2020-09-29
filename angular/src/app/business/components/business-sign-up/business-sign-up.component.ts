import { UserService } from "@/user/services/user.service";
import { ERole } from "@/user/interfaces/iuser";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { IUser } from "@/user/interfaces/iuser";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { IBusiness, emptyBusiness } from "@/business/interfaces/IBusiness";
import { HttpSignUpService } from "@/core/http/http-sign-up.service";
import { BusinessService } from "@/business/services/business.service";
import { HttpBusinessService } from "@/core/http/http-businesses.service";

@Component({
  selector: "business-sign-up",
  templateUrl: "./business-sign-up.component.html",
  styleUrls: ["./business-sign-up.component.scss"],
})
export class BusinessSignUpComponent implements OnInit {
  user: IUser;
  businessToRegisterTo = emptyBusiness();
  constructor(
    private authService: AuthenticationService,
    private businessService: BusinessService,
    private httpBusiness: HttpBusinessService,
    private snackBar: MatSnackBar,
    private signUpService: HttpSignUpService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.businessToRegisterTo = this.businessService.currentBusiness;
    if (this.isInSystem()) { // if user is connected' insert value to current object
      this.user = this.authService.currentUserValue;
    }
  }

/**
 * adding new client to specific business
 * @param business
 */
  addNewClient(business: IBusiness) {
    const self = this;
    const currentUser =
      this.user != null ? this.user : this.authService.currentUserValue;
    this.httpBusiness
      .httpSignClientToBusiness(business.bName, currentUser.email)
      .subscribe(
        (data) => {
          if (data != null) {
            self.snackBar.open(
              `Thank You!
        you are now registerd to ${business.bName}`,
              "",
              {
                duration: 2000,
              }
            );
            self.businessService.addToBusinessClients(data);
            self.userService.addClientToList(data);
          }
          // if user already connected' navigate it to business
          if (currentUser.token) {
            this.authService.currentUserType = ERole.User;
            self.router.navigate(["/business"]);
          } else {
            self.router.navigate(["/business/registration/login"]);
          }
        },
        (error) => {
          self.snackBar.open(
            `error.
           registration to ${business.bName} has failed`,
            "",
            {
              duration: 2000,
            }
          );
        }
      );
  }

  /**
   * check if  user already connected to the system
   */
  isInSystem(): boolean {
    const currentUser = this.authService.currentUserValue;
    return currentUser !== undefined && currentUser.type !== ERole.Unsigned;
  }

  /**
   * signing the user to the system
   * @param user - user to submit it
   */
  onSubmit(user: IUser) {
    const self = this;
    this.signUpService.signUp(user).subscribe(
      (data) => {
        this.user = data;
        self.addNewClient(this.businessToRegisterTo);
      },
      (error) => {
        self.snackBar.open(error, "", {duration: 3000});
      }
    );
  }
}
