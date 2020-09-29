import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from '@/core/authentication/authentication.service';
import { UserService } from '@/user/services/user.service';

import { Component, OnInit, Inject, APP_INITIALIZER } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { initDomAdapter } from "@angular/platform-browser/src/browser";

import { HttpUserService } from "@/core/http/http-user.service";
import { IUser, emptyUser } from "@/user/interfaces/iuser";

@Component({
  selector: "edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.scss"]
})
export class EditUserComponent implements OnInit {
  user = emptyUser();
  birthDay: string;
  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUser,
    private authService: AuthenticationService,
    private httpUser: HttpUserService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this._init();
  }

  _init() {

    // tslint:disable-next-line: forin
    for (const key in this.data) {
      this.user[key] = this.data[key];
    }
    // translating birth day in to a string
    this.birthDay = this.user.bDay !== 0 ? this.userService.tranlateDate(new Date(this.user.bDay), true) : 'yyyy-mm-dd';
  }

  /**
   * Closes edit user component
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Saves edit user component changes in user details
   */
  save() {
    this.user.bDay = this.userService.setBirthDay(this.birthDay);
    const self = this;
    this.httpUser
      .httpUpdateUser(self.user)
      .then(data => {
        if (data === true) {
          // if success => update current user details
          this.authService.currentUserValue = self.user;
          // tslint:disable-next-line: forin
          for (const key in self.user) {
            self.data[key] = self.user[key];
          }
          self.snackBar.open("saved", "", {duration: 2000});
        }
      })
      .catch(err => {
        self.snackBar.open(err, "" , { duration: 3000});
      });
    this.dialogRef.close();
  }
}
