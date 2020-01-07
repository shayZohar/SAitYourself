import { Component } from '@angular/core';
import { IUser } from './user/interfaces/iuser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  realName = 'shay the putzy';


  constructor(
  ) {

  }



}
