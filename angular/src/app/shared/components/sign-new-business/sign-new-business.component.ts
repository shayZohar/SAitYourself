import { HttpBusinessService } from "@/core/http/http-businesses.service";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import {
  ControlContainer,
  NgForm,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IBusiness} from "@/business/interfaces/IBusiness";

@Component({
  selector: "sign-new-business",
  templateUrl: "./sign-new-business.component.html",
  styleUrls: ["./sign-new-business.component.scss"],
  // connect to a form
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class SignNewBusinessComponent
  implements OnInit {
  isChecked = false;
  @Input() business: IBusiness;
  // tslint:disable-next-line: variable-name
  private _userEmail: string;
  @Input() set userEmail(value: string) {
    this._userEmail = value;
    setTimeout(() => this.checkEmail(), 300);
  } get userEmail(): string {
    return this._userEmail;
  }
  @Output() businessToSign = new EventEmitter<IBusiness>();
  @Output() canSignBusiness = new EventEmitter<boolean>();
  previusBmail: string;

  constructor(
    private httpBusiness: HttpBusinessService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  /**
   * Checks if business email is equal to user email
   * if equal then resets business email
   */
  checkEmail() {
    const isEqualEmail =
      this.business.bMail === this.userEmail && this.business.bMail !== "";
    if (isEqualEmail) {
      this.snackBar.open("can not use your own email for your business", "", {
        duration: 3000
      });
      this.business.bMail = "";
    }
  }

  /**
   * Determines whether the sign new business form is valid
   * @param value - the form to check
   */
  isValid(value) {
    if (value.status === "VALID") {
      this.checkIfBusinessExists();
    }
  }

  /**
   * Checks if business Name already exists in system
   */
  checkIfBusinessExists() {
    const self = this;
    this.httpBusiness.httpCheckBusinessName(this.business.bName).subscribe(
      data => {
        if (data === false) {
          self.checkeBusinessEmail();
        } else {
          self.business.bName = "";
          self.snackBar.open(
            "Business name alredy in the system please change the name",
            "",
            { duration: 2000 }
          );
        }
      },
      error => {
        self.snackBar.open(error, "" , { duration: 3000});
      }
    );
  }

  /**
   * Checkes if business email exists in system
   */
  checkeBusinessEmail() {
    const self = this;
    this.httpBusiness.httpCheckBusinessEmail(this.business.bMail).subscribe(
      data => {
        if (data === false) {
          self.businessToSign.emit(self.business);
        } else {
          self.business.bMail = "";
          self.snackBar.open(
            "Business Email alredy in the system\n please change Email",
            "Dismiss",
            { duration: 3000 }
          );
        }
      },
      error => {
        self.snackBar.open(error, "" , { duration: 3000});
      }
    );
  }
}
