import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {PanelModule} from 'primeng/panel';
import {ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { MaterialModule } from '@/material/material.module';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { BusinessRoutingModule } from './business-routing.module';
import { BusinessAboutComponent } from './pages/business-about/business-about.component';
import { BusinessContactComponent } from './pages/business-contact/business-contact.component';
import { BusinessHomeComponent } from './pages/business-home/business-home.component';
import { PrimeNgModule } from '@/material/primeng.module';
import { SharedModule } from '@/shared/shared.module';
import { UserModule } from '@/user/user.module';
import { BusinessAppointmentComponent } from './pages/business-appointment/business-appointment.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {CalendarModule} from 'primeng/calendar';
import { BusinessRegistrationComponent } from './pages/business-registration/business-registration.component';
import { BusinessSignUpComponent } from './components/business-sign-up/business-sign-up.component';
import { BusinessLoginComponent } from './components/business-login/business-login.component';


@NgModule({
  declarations: [
    BusinessAboutComponent,
    BusinessContactComponent,
    BusinessHomeComponent,
    BusinessAppointmentComponent,
    BusinessRegistrationComponent,
    BusinessSignUpComponent,
    BusinessLoginComponent,
  ],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    DataViewModule,
    DialogModule,
    PanelModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ScheduleModule,
    MultiSelectModule,
    CalendarModule,

    PrimeNgModule,
    SharedModule,
    UserModule,
  ],
})
export class BusinessModule {}
