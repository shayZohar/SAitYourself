import { Component, OnInit } from '@angular/core';
import { IUser } from '@/modules/user/interfaces/iuser';

@Component({
  selector: 'app-home-sign-up',
  templateUrl: './home-sign-up.component.html',
  styleUrls: ['./home-sign-up.component.scss']
})
export class HomeSignUpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  ///////////////////////////////////////////////////
  //function to receive input data from sign up form
  ///////////////////////////////////////////////////
  onSubmit(user: IUser ) {
    alert('event happened');

  }

}
