import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { INavLinks } from '@/shared/interfaces/inav-links';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  ///////////////////////////////////
  // links- array for nav
  //////////////////////////////////

  ///////////////////////////////////
  // this is an example for observables for others to listen to
  ///////////////////////////////////
  links = new Subject<INavLinks[]>();
  // helpME subject
  // subject and services methods

  constructor() { }
  // this method sends the changes outside
  // who ever is subscribed to this method can get the changes
  getLinks(): Observable<INavLinks[]> {
    return this.links.asObservable();
  }

  setLinks(links: INavLinks[]) {
    // next calls for the change and input changes
    this.links.next(links);
  }


}
