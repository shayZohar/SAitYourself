import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';

import { MaterialModule } from '@/material/material.module';
import { PrimeNgModule } from '@/material/primeng.module';

import { SharedModule } from '@/shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { PersonalZoneComponent } from './components/personal-zone/personal-zone.component';
import { AdminPersonalZoneComponent } from './components/admin-personal-zone/admin-personal-zone.component';
import { OwnerPersonalZoneComponent } from './components/owner-personal-zone/owner-personal-zone.component';
import { ClientPersonalZoneComponent } from './components/client-personal-zone/client-personal-zone.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatTabsModule,
    MaterialModule,
    SharedModule,
    PrimeNgModule,
    UserRoutingModule,
  ],
  declarations: [
    PersonalZoneComponent,
    AdminPersonalZoneComponent,
    OwnerPersonalZoneComponent,
    ClientPersonalZoneComponent,
  ],
  exports: [
    PersonalZoneComponent
  ]
})
export class UserModule { }
