import {  map } from 'rxjs/operators';
import { BusinessService } from '@/business/services/business.service';
import { HttpMessagesService } from '@/core/http/http-messages.service';
import { HttpBusinessService } from '@/core/http/http-businesses.service';
import { Route } from '@angular/compiler/src/core';
import { IAppointment, emptyAppointment } from '@/business/interfaces/iAppointment';
import { Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBusiness } from '../interfaces/IBusiness';
import { emptyMessage } from '@/shared/interfaces/IMessage';

@Injectable({
  providedIn: 'root'
})
export class AppointmentResolverService implements Resolve<IAppointment> {
  currentBusiness: IBusiness;
  appointment = emptyAppointment();
  newApp = emptyAppointment();
  message = emptyMessage();
  settings = 'SiteSettings';
  constructor(private businessService: HttpBusinessService,
              private messageService: HttpMessagesService,
              private bService: BusinessService ,
              private router: Router) { }
  //////////////////////////////////////////////////////////////////////////////////
  // make request for appointment from data base.
  // when the response is here, return the appointment and activate the route
  // waiting for trainee.
  // in case of error stay in the home route
  //////////////////////////////////////////////////////////////////////////////////
  resolve(route: Route, state: RouterStateSnapshot): Observable<IAppointment>  {
    this.currentBusiness = JSON.parse(localStorage.getItem(this.settings));
    return this.businessService.getAppointment(this.currentBusiness.bName)
      .pipe (
        map(
          response => {
            return response;
          }),
      );
  }

}
