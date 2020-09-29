import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { BusinessService } from "@/business/services/business.service";
import { emptyBusiness, IBusiness } from "@/business/interfaces/IBusiness";
import { ERole } from "@/user/interfaces/iuser";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { IUser } from "@/user/interfaces/iuser";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-business-login",
  templateUrl: "./business-login.component.html",
  styleUrls: ["./business-login.component.scss"],
})
export class BusinessLoginComponent implements OnInit {
  user: IUser;
  constructor(
    private authService: AuthenticationService,
    private businessService: BusinessService,
    private httpBusiness: HttpBusinessService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
  ngOnInit() {}

  /**
   * logging user to system via business site
   * @param user - to log-in with
   */
  onSubmit(user: IUser) {
    const self = this;
    this.authService
      .logInUserToBusiness(
        user.email,
        user.pWord,
        this.businessService.CurrentBusiness.bName
      )
      .subscribe(
        (data) => {
          if (data != null) {
            self.snackBar.open("login successfuly", "", {
              duration: 2000,
            });
            const business = self.businessService.CurrentBusiness;
            const owner = business.bOwner.includes(data.email);
            const client = business.bClient.includes(data.email);
            const registeredToBusiness = client || owner;
            if (registeredToBusiness) {
              // client or owner
              if (business.ownerConnected && client) {

                business.ownerConnected = false;
                self.businessService.changeCurrentBusiness(business);
                self.router.navigate(["/business"]);
              } else if (data.type === ERole.Business && owner) {
                // if business Owner then this business owner
                self.updateCurrentOwner(business);
              } else {
                self.router.navigate(["/business"]);
              }
            } else if (data.token && data.type == ERole.Admin) {
              self.router.navigate(["/business"]);
            } else {
              self.router.navigate(["/business/registration"]);
            }
          }
        },
        (error) => {
          self.snackBar.open(
            "not registered, please sign-up",
            "",
            {
              duration: 4000,
            }
          );
          self.router.navigate(["/business/registration"]);
        }
      );
  }

  /**
   *
   * @param business - to update current business to edit mode
   */
  updateCurrentOwner(business: IBusiness) {
    const self = this;
    this.httpBusiness
      .httpUpdateBoolFields(true, business.bName, "OwnerConnected")
      .subscribe((data) => {
        if (data === false) {
          // can not edit
          self.snackBar.open(
            "editing unavailable - another owner is connected",
            "",
            {
              duration: 2000,
            }
          );
        }
        business.ownerConnected = data;
        this.businessService.changeCurrentBusiness(business);
        self.router.navigate(["/business"]);
      },
      error => {
        self.snackBar.open(
         error,
          "",
          {
            duration: 3000,
          }
        );
      });
  }
}
