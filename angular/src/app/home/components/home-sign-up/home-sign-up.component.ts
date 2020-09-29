import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { Router } from "@angular/router";
import { BusinessService } from "@/business/services/business.service";
import { Component, OnInit } from "@angular/core";
import { IUser, ERole } from "@/user/interfaces/iuser";
import { HttpSignUpService } from "@/core/http/http-sign-up.service";
import { IBusiness, emptyBusiness } from "@/business/interfaces/IBusiness";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "home-sign-up",
  templateUrl: "./home-sign-up.component.html",
  styleUrls: ["./home-sign-up.component.scss"]
})
export class HomeSignUpComponent implements OnInit {

  clientBusiness = emptyBusiness();
  constructor(
    private snackBar: MatSnackBar,
    private businessService: BusinessService,
    private httpBusiness: HttpBusinessService,
    private signUpService: HttpSignUpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getBusinesses();
  }

  /**
   * Gets businesses list for user to choose from
   */
  getBusinesses() {
    this.httpBusiness.getBusiness().subscribe(
      data => {
        this.businessService.businessesList = data;
        this.businessService.haveBusinessesList = true;
      },
      error => {
        this.snackBar.open(error, "", {duration: 3000});
      }
    );
  }

  /**
   * receive input data from sign up form
   * try to sign up
   */
  onSubmit(user: IUser) {
    const self = this;
    this.signUpService.signUp(user).subscribe(
      data => {
        this.snackBar.open("Tank You! Registeration is Comlete", "", {
          duration: 3000
        });
        if (user.type === ERole.User) {
          self.addNewClient(self.clientBusiness);
        }
      },
      error => {
       self.snackBar.open(error, "" , { duration: 3000});
      }
    );
  }

  /**
   * Adds new client to business
   * @param business - required business
   */
  addNewClient(business: IBusiness) {
    const self = this;
    this.httpBusiness.httpSignClientToBusiness(business.bName, business.bClient[business.bClient.length - 1]).subscribe(
      data => {
        if (data != null) {
          self.snackBar.open(
            `Thank You!
        you are now registerd to ${business.bName}`,
            "",
            {
              duration: 3000
            }
            );
        } else {
          self.snackBar.open(
            `error.
            registration to ${business.bName} has failed`,
            "",
            {
              duration: 4000
            }
          );
        }
        self.router.navigate(["/registration"]);
      },
      error => {
        self.snackBar.open(error, "" , { duration: 3000});
      }
    );
  }

  /**
   * when submitting a new business
   * @param business - new business to submit
   */
  onSubmitBusiness(business: IBusiness) {
    const self = this;
    this.signUpService.signBusiness(business).subscribe(
      data => {
        this.snackBar.open("Thank You. Business is registered", "", {
          duration: 2000
        });
        this.router.navigate(["/registration"]);
      },
      error => {
        self.snackBar.open(error, "" , { duration: 3000});
      }
    );
  }

  /**
   * Gets businesses list
   * @returns businesses list
   */
  getBusinessesArray(): IBusiness[] {
    if (this.businessService.haveBusinessesList !== undefined) {
      return this.businessService.businessesList;
    }
  }

}
