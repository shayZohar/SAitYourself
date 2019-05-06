import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { HomeRoutingModule } from './home-routing.module';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from '../../pages/page-not-found/page-not-found.component';
import { SharedModule } from '@/shared/shared.module';
import { HomeRegistrationComponent } from './pages/home-registration/home-registration.component';
import { HomeLoginComponent } from './components/home-login/home-login.component';
import { HomeSignUpComponent } from './components/home-sign-up/home-sign-up.component';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
  ],
  declarations: [
    ContactComponent,
    AboutComponent,
    HomeComponent,
    HomeRegistrationComponent,
    PageNotFoundComponent,
    HomeLoginComponent,
    HomeSignUpComponent
  ],
})
export class HomeModule { }
