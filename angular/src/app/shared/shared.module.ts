import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NavMainComponent } from './components/nav-main/nav-main.component';
import { SignUpComponent } from './sign-up/sign-up.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  declarations: [
    NavMainComponent,
    SignUpComponent,
  ],
  exports: [
    NavMainComponent,
    SignUpComponent,
  ]
})
export class SharedModule { }
