import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { IUser, emptyUser } from '@/user/interfaces/iuser';
import { NgModel } from '@angular/forms';



@Component({
  selector: 'sh-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() logIn = new EventEmitter<IUser>();
  user: IUser = emptyUser();
  eyeStatus = 'password';

  constructor() { }

  ngOnInit() {


  }
  onSubmit() {
    this.logIn.emit(this.user);
  }

}
