
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';

import { MaterialModule } from '@/material/material.module';

import { UserRoutingModule } from './user-routing.module';
import { UserDisplayComponent } from './components/user-display/user-display.component';
import { PersonalZoneComponent } from './components/personal-zone/personal-zone.component';
import { ListToShowComponent } from './components/list-to-show/list-to-show.component';
import { AdminPersonalZoneComponent } from './components/admin-personal-zone/admin-personal-zone.component';
import { OwnerPersonalZoneComponent } from './components/owner-personal-zone/owner-personal-zone.component';
import { ClientPersonalZoneComponent } from './components/client-personal-zone/client-personal-zone.component';
import { BusinessListComponent } from './components/business-list/business-list.component';
import { UsersListComponent } from './components/users-list/users-list.component';


@NgModule({
  declarations: [
    UserDisplayComponent,
    PersonalZoneComponent,
    ListToShowComponent,
    ListToShowComponent,
    AdminPersonalZoneComponent,
    OwnerPersonalZoneComponent,
    ClientPersonalZoneComponent,
    BusinessListComponent,
    UsersListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MatTabsModule,
    MaterialModule,

    UserRoutingModule
  ],
  exports: [
    UserDisplayComponent,
    PersonalZoneComponent
  ]
})
export class UserModule { }
