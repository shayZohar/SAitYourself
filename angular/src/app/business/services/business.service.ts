import { ERole } from './../../user/interfaces/iuser';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { HttpMessagesService } from '@/core/http/http-messages.service';
import { NavbarService } from '@/services/navbar.service';
import { navLinksList } from '@/home/nav-links';
import { INavLinks } from '@/shared/interfaces/inav-links';
import { AuthenticationService } from '@/core/authentication/authentication.service';
import { IMessage, emptyMessage } from '@/shared/interfaces/IMessage';
import { IUser } from '@/user/interfaces/iuser';
import { HttpBusinessService } from '@/core/http/http-businesses.service';
import { HttpUserService } from '@/core/http/http-user.service';
import { IBusiness } from '@/business/interfaces/IBusiness';
import { Ihome } from '../interfaces/ihome';
import { businessNavLinksList } from '../business-nav-links';
import { IAbout } from '../interfaces/iAbout';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  links: INavLinks[] = businessNavLinksList;
  currentBusiness: IBusiness;
  message: IMessage = emptyMessage();
  recievedMessages: IMessage[];
  sendMessages: IMessage[];
  recievedNumber;

  constructor(
    private navbarService: NavbarService,
    private authenticationService: AuthenticationService,
    private messageService: HttpMessagesService,
    private userService: HttpUserService,
    private httpBusiness: HttpBusinessService
  ) {}

  init() {
    // helpME shaynew
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.type === ERole.Business && this.currentBusiness.bOwner.includes(currentUser.email)){
      this.links[1].label = 'Messages';
    }
    this.navbarService.setLinks(this.links);
    this.recieveMessages(currentUser);
    this.sentMessages(currentUser);
  }

  getBusinessUsers(email: string) {
    const self = this;
    this.httpBusiness.getOwnerBusinesses(email).subscribe(
      data => {
        self.currentBusiness = data;
      },
      error => {
        console.log(typeof error);
      }
    );
  }

  changeCurrentBusiness(newBusiness: IBusiness) {
    this.currentBusiness = this.httpBusiness.currentBusiness = newBusiness;
  }

  updateCurrentHome(home: Ihome) {
      for ( const index in home) {
        if ( home[index] && home[index] !== '') {
          this.currentBusiness.bHome[index] = home[index];
        }
      }
  }
  updateCurrentAbout(about: IAbout) {
    for ( const index in about) {
      if ( about[index] && about[index] !== '') {
        this.currentBusiness.bAbout[index] = about[index];
      }
    }
}
  updateHomePage(business: IBusiness) {
    const self = this;
    this.httpBusiness.updateHomePage(business).subscribe(
      data => {
        self.updateCurrentHome(data);
        console.log(data);
      },
      error => {
        console.log(typeof error);
      }
    );
  }

  updateAboutPage(business: IBusiness) {
    const self = this;
    this.httpBusiness.updateAboutPage(business).subscribe(
      data => {
        self.updateCurrentAbout(data);
        console.log(data);
      },
      error => {
        console.log(typeof error);
      }
    );
  }

  /////////////////////////////////////////////////////
  // method to recieve all of user messages message
  /////////////////////////////////////////////////////
  recieveMessages(u: IUser) {
    this.messageService.getRecievedMessages(u.email).subscribe(
      data => {
        console.log(data, data.length);
        this.recievedMessages = data;
        this.countUnread();
        for (const item of this.recievedMessages) {
          console.log(item.subJect);
        }
      },
      error => {
        console.log(typeof error);
      }
    );
  }

  /////////////////////////////////
  // method to recieve all of user sent messages
  ////////////////////////////////
  sentMessages(u: IUser) {
    this.messageService.getSentMessages(u.email).subscribe(
      data => {
        console.log(data, data.length);
        this.sendMessages = data;

        for (const item of this.sendMessages) {
          console.log(item.subJect);
        }
      },
      error => {
        console.log(typeof error);
      }
    );
  }
  ///////////////////////////////////////
  // count how many unread messages exists
  ///////////////////////////////////////
  countUnread() {
    let unread = 0;

    // helpME function to count fields in array
    const reducer = (count, item) => count + item.read === false;
    unread = this.recievedMessages.reduce(reducer, 0); // 0 is the initial total value

    console.log(`num of unread messages:   ${unread}`);
    this.recievedNumber = unread;
  }
  /////////////////////////////////
  // method to send message
  ////////////////////////////////
  sendMessage(mes: IMessage) {
    this.messageService.sendMessage(mes).subscribe(
      data => {
        console.log('data');
      },
      error => {
        console.log('error');
      }
    );
  }
  /////////////////////////////////
  // method to update messages as read
  ////////////////////////////////
  updateAsRead(recId: string) {
    this.messageService.setAssReadMessages(recId).subscribe(
      data => {
        console.log('data ' + recId);
      },
      error => {
        console.log('error');
      }
    );
  }
}
