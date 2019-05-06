import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { IUser, emptyUser} from '@/modules/user/interfaces/iuser';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sh-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  user: IUser = emptyUser();
  userTypes: string[] = ['Admin', 'Bussines Owner', 'Client'];
  @Output() signUp = new EventEmitter<IUser>();
  constructor() {}

  ngOnInit() {
    this.user.userType = 'Client';
  }

  comparePasswords(firstPassword: string, secondPassword: string) {
    return firstPassword === secondPassword;
  }
  onSubmit() {
    this.signUp.emit(this.user);

  }
}
