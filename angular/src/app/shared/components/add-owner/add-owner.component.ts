import { HttpSignUpService } from "@/core/http/http-sign-up.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpUserService } from "@/core/http/http-user.service";
import { BusinessService } from "@/business/services/business.service";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { UserService } from "@/user/services/user.service";
import { IUser } from "@/user/interfaces/iuser";

@Component({
  selector: "sh-add-owner",
  templateUrl: "./add-owner.component.html",
  styleUrls: ["./add-owner.component.scss"],
})
export class AddOwnerComponent implements OnInit {
  @Output() submitOwner = new EventEmitter<boolean>();

  newOwnerEmail: string;

  addOwnerForm: boolean;
  constructor(
    private businessService: BusinessService,
    private userService: UserService,
    private httpUser: HttpUserService,
    private signUpService: HttpSignUpService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.addOwnerForm = true;
  }

  /**
   * adding existing user to business owners
   * @param newOwner - the email of the new owner to add
   */
  onSubmitOwner(newOwner: string) {
    // check if user already registered to the business as an owner or a client
    const inBusinessSystem =
      this.businessService.CurrentBusiness.bOwner.includes(
        this.newOwnerEmail
      ) ||
      this.businessService.CurrentBusiness.bClient.includes(this.newOwnerEmail);
    if (inBusinessSystem) {
      this.snackBar.open("error, user already registerd to business  as owner / client", "", {
        duration: 3000,
      });
      this.newOwnerEmail = "";
    } else {
      // user not listed to business
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const self = this;
      this.httpUser
        .httpAddOwner(this.businessService.CurrentBusiness.bName, newOwner)
        .subscribe(
          (data) => {
            if (data !== null) {
              // owner Has been added
              self.userService.addOwnerToList(data, currentUser);
              self.snackBar.open("owner added", "", {
                duration: 2000,
              });
              self.submitOwner.emit(true);
            }
          },
          (error) => {
            self.snackBar.open("email not found - sign-up", "", {
              duration: 5000,
            });
            // open form of sign-up
            self.addOwnerForm = !self.addOwnerForm;
          }
        );
    }
  }

  /**
   *  submitting new user to the system
   * @param user - user details to up to system
   */
  onSubmit(user: IUser) {
    const self = this;
    this.signUpService.signUp(user).subscribe(
      (data) => {
        // submiting the  new user to business owner list
        self.onSubmitOwner(user.email);
      },
      (error) => {
        self.snackBar.open(`${error}`, "", {
          duration: 3000,
        });
      }
    );
  }

  // closing add owner form
  closeSignUp() {
    this.addOwnerForm = !this.addOwnerForm;
  }
}
