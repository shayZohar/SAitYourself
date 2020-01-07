import { HttpBusinessService } from '@/core/http/http-businesses.service';
import { HttpSignUpService } from '@/core/http/http-sign-up.service';
import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { NgModel, FormControl, Validators } from '@angular/forms';

import { IUser, emptyUser } from '@/user/interfaces/iuser';
import { cleanSession } from 'selenium-webdriver/safari';
import { HttpUserService } from '@/core/http/http-user.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { IBusiness, emptyBusiness } from '@/business/interfaces/IBusiness';
import { defaultHomeVal } from '@/business/interfaces/ihome';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sh-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  businesSelect = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('', Validators.required);
  businessType: string[] = ['Shop', 'Beuty & Hair'];
  business: IBusiness = emptyBusiness();
  user: IUser = emptyUser();

  userTypes: string[] = ['Admin', 'Business Owner', 'Client'];
  @Output() signUp = new EventEmitter<IUser>();
  @Output() signBusiness = new EventEmitter<IBusiness>();
  eyeStatus = 'password';
  verEyeStatus = 'password';
  bTypes: string[] = ['a', 'b', 'c'];
  bName = '';
  bType = '';
  constructor(
    private checkEmailService: HttpUserService,
    private snackBar: MatSnackBar,
    private httpSignUp: HttpSignUpService,
    private checkBusinessService: HttpBusinessService
  ) {}

  ngOnInit() {

    this.user.type = 'Client';
  }

  // comparePasswords(firstPassword: string, secondPassword: string) {
  //   return firstPassword === secondPassword;
  // }
  onSubmit() {
    console.log('submit signup');
    this.checkExistance(this.user.email);

  }

  // setType(type: string): void {
  //   this.user.type = type;
  // }
  ////////////////////////////////////////////////
  // method to check if email is alredy in system
  ///////////////////////////////////////////////
  checkExistance(email: string) {
    const self = this;
    this.checkEmailService.findEmail(email).subscribe(
      data => {
        console.log('data');
        if (data === true) {
          ////////////////////////////////////////////
          // found a user with this email
          ///////////////////////////////////////////
          this.snackBar.open('Email already exist in system', '', {
            duration: 3000
          });
        } else {

          /////////////////////////////////////////////
          // the email is not in system
          ////////////////////////////////////////////
          if (self.user.type === 'Business Owner') {
            self.business.bOwner.push(self.user.email);
            // AMIT defalt values for business home page
            self.business.bHome =  defaultHomeVal();
            console.log(self.business.bType + self.business.bName + '');
            // AMIT
            self.signBusiness.emit(self.business);
          }
          self.signUp.emit(self.user);
          self.snackBar.open('Thank you', '', { duration: 3000 });
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
