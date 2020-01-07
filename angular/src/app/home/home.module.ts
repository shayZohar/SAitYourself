
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import { MaterialModule } from '@/material/material.module';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';

import {ScheduleModule, AgendaService, DayService, WeekService, WorkWeekService, MonthService } from '@syncfusion/ej2-angular-schedule';

import { HomeRoutingModule } from './home-routing.module';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from '@/pages/page-not-found/page-not-found.component';
import { SharedModule } from '@/shared/shared.module';
import { HomeRegistrationComponent } from './pages/home-registration/home-registration.component';
import { HomeLoginComponent } from './components/home-login/home-login.component';
import { HomeSignUpComponent } from './components/home-sign-up/home-sign-up.component';
import { FirstStepRegComponent } from './components/first-step-reg/first-step-reg.component';
import { CoreModule } from '@/core/core.module';
import { HomePersonalZoneComponent } from './pages/home-personal-zone/home-personal-zone.component';
import { UserModule } from '@/user/user.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    UserModule,
    MaterialModule,
    // MatSelectModule,
    ScheduleModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ContactComponent,
    AboutComponent,
    HomeComponent,
    HomeRegistrationComponent,
    HomeLoginComponent,
    HomeSignUpComponent,
    FirstStepRegComponent,
    HomePersonalZoneComponent,
    // ClientRegistrationComponent,
    // BusinessOwnerRegistrationComponent
  ],
  providers: [
    AgendaService,
    DayService,
    WeekService,
    WorkWeekService,
    MonthService
  ],
})
export class HomeModule { }
