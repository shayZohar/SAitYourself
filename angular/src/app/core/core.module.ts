import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { MaterialModule } from '@/material/material.module';
import { JwtInterceptor } from './interceptors/jwt.interceptor';



@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,

  ],
  declarations: [],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass : HttpErrorInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ]
})
export class CoreModule {}
