
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeRegistrationComponent } from './pages/home-registration/home-registration.component';
import { HomeLoginComponent } from './components/home-login/home-login.component';
import { HomeSignUpComponent } from './components/home-sign-up/home-sign-up.component';
import { PersonalZoneComponent } from '@/user/components/personal-zone/personal-zone.component';
import { AuthGuard } from '@/core/guards/auth.guard';
import { ERole } from '@/user/interfaces/iuser';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'my-zone',
    canActivate: [AuthGuard],
    data: { roles: [ERole.Business, ERole.User, ERole.Admin]},
    component: PersonalZoneComponent
  },
  {
    path: 'registration',
    component: HomeRegistrationComponent,
    children: [

          {
            path: '',
            redirectTo: 'login',
            pathMatch: 'full'
          },
          {
            path: 'login',
            component: HomeLoginComponent
          },
          {
            path: 'sign-up',
            component: HomeSignUpComponent
          }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
