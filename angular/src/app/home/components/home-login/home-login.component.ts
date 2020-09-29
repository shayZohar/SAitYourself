import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { IUser, ERole } from "@/user/interfaces/iuser";
import { Router, ActivatedRoute } from "@angular/router";
import { BusinessService } from "@/business/services/business.service";

@Component({
  selector: "home-login",
  templateUrl: "./home-login.component.html",
  styleUrls: ["./home-login.component.scss"]
})
export class HomeLoginComponent implements OnInit {
  @Output() logIn = new EventEmitter<IUser>();
  user: IUser;
  constructor(
    private logInService: AuthenticationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  /**
   * Determines whether submit on succeed
   * @param user - user to log in with
   */
  onSubmit(user: IUser) {
    const self = this;
    this.logInService.logInUser(user.email, user.pWord).subscribe(
      data => {
        if (data != null) {
          this.snackBar.open("login successfuly", "", {
            duration: 2000
          });
          self.user = data;
          if (self.user.type) {
            self.router.navigate(["/my-zone"]);
          }
        }
      },
      error => {
        this.snackBar.open("login failed", "", {
          duration: 2000
        });
      }
    );
  }

}
