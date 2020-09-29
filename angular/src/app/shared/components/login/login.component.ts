import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { IUser, emptyUser } from '@/user/interfaces/iuser';



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

  /**
   * emiting user to host component
   */
  onSubmit() {
    this.logIn.emit(this.user);
  }

}
