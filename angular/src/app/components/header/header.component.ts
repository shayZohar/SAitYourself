import { AuthenticationService } from '@/core/authentication/authentication.service';
import { Component, OnInit, Input } from '@angular/core';

import { INavLinks } from '@/shared/interfaces/inav-links';
import { NavbarService } from '@/services/navbar.service';


import { IUser } from '@/user/interfaces/iuser';
import { Router } from '@angular/router';
import { ERole } from '@/user/interfaces/iuser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  ///////////////////////////////////
  // links- array for nav
  //////////////////////////////////
  links: INavLinks[];

  currentUser: IUser;


  constructor(
    private navbarService: NavbarService,
    private router: Router,
    private authenticationService: AuthenticationService
    ) {
    // on any change of links, this links will be updated
    // "getLinks()" is from navbar.service.ts
    this.navbarService.getLinks().subscribe(value => this.links = value);
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {

  }

  /**
   * Logouts header component
   * logging out from system after logout event from shared-nav-main-component
   */
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/home']);
  }

}

