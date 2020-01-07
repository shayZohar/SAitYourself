import { BusinessModule } from './business/business.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { UserModule } from './user/user.module';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CoreModule } from './core/core.module';
import { AdminModule } from './admin/admin.module';
import { MaterialModule } from './material/material.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';



@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    CoreModule,

    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,


    SharedModule,
    HomeModule,
    UserModule,
    AdminModule,
    BusinessModule,
    // main roiuting, put after all moduls with routing because of arouting to ** in this one
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    // AUTH-ADDED 1
    // AdminHomeComponent,
  ],

  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

