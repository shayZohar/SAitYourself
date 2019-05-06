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
  links  = new Subject<INavLinks[]>();

  constructor() { }

  getLinks(): Observable<INavLinks[]> {
      return this.links.asObservable();
  }

  setLinks(links: INavLinks[]) {
      this.links.next(links);
  }

}
