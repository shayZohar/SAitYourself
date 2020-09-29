import { ERole } from '@/user/interfaces/iuser';
import { AuthenticationService } from '@/core/authentication/authentication.service';
import { Injectable } from '@angular/core';

import { NavbarService } from '@/services/navbar.service';
import { INavLinks } from '@/shared/interfaces/inav-links';
import { navLinksList } from '../nav-links';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  links: INavLinks[] = navLinksList;


  constructor(
    private navbarService: NavbarService,
    private authenticationService: AuthenticationService
  ) {  }

  /**
   * building links for nav-bar and set them
   */
  init() {
    if (this.authenticationService.currentUserType === ERole.Unsigned) {
      // loging out if unsined user to clear storeges
      this.authenticationService.logout();
    }
    if (this.authenticationService.currentUserValue) {
      this.links = navLinksList.filter(obj => {
        return obj.label.toLocaleLowerCase() !== 'login';
      });
    } else {
      // shallow copy. actually can be just pointers assignment. never mind this copy is more safe
      this.links = navLinksList.slice();
    }
    this.navbarService.setLinks(this.links);
    localStorage.setItem('links', 'home');
  }


}
