
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {PanelModule} from 'primeng/panel';

import { MaterialModule } from '@/material/material.module';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { BusinessRoutingModule } from './business-routing.module';
import { BusinessAboutComponent } from './pages/business-about/business-about.component';
import { BusinessContactComponent } from './pages/business-contact/business-contact.component';
import { BusinessHomeComponent } from './pages/business-home/business-home.component';
import { MessagesComponent } from '../shared/components/messages/messages.component';
import { PrimeNgModule } from '@/material/primeng.module';
import { SharedModule } from '@/shared/shared.module';
import { BusinessPersonalZoneComponent } from './pages/business-personal-zone/business-personal-zone.component';
import { UserModule } from '@/user/user.module';
import { from } from 'rxjs';
@NgModule({
  declarations: [
    BusinessAboutComponent,
    BusinessContactComponent,
    BusinessHomeComponent,
    BusinessPersonalZoneComponent,
    // MessagesComponent, Tania should be in shared
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

    PrimeNgModule,
    SharedModule,
    UserModule,
  ]
})
export class BusinessModule {}
