
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@/material/material.module';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
// tslint:disable-next-line: import-spacing
import {ScheduleModule, AgendaService, DayService, WeekService, WorkWeekService, MonthService }
 from '@syncfusion/ej2-angular-schedule';
import { HomeRoutingModule } from './home-routing.module';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from '@/shared/shared.module';
import { HomeRegistrationComponent } from './pages/home-registration/home-registration.component';
import { HomeLoginComponent } from './components/home-login/home-login.component';
import { HomeSignUpComponent } from './components/home-sign-up/home-sign-up.component';
import { UserModule } from '@/user/user.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    UserModule,
    MaterialModule,
    ScheduleModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ContactComponent,
    HomeComponent,
    HomeRegistrationComponent,
    HomeLoginComponent,
    HomeSignUpComponent,
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
