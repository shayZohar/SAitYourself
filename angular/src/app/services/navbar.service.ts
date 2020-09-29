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

  links = new Subject<INavLinks[]>();
  unredCount = new Subject<number>();
  seeMessages = new Subject<boolean>();
  messageTip = new Subject<string>();

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

  // setting the next value of unread messages count for badge
  messageBadgeCount(unredCount: number) {
    this.unredCount.next(unredCount);
  }

  // setting whether can or can not click messages on nav bar,
  // and the tool tip of this link
  canSeeMessages(canSee: boolean, tip: string) {
    this.seeMessages.next(canSee);
    this.messageTip.next(tip);
  }
}
