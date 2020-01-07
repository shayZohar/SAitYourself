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
    // AMIT ask tania
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    // router.events.subscribe( (event) => ( event instanceof NavigationEnd ) && this.handleRouteChange() )
    // How to change navmenu header based on route
    // https://stackoverflow.com/questions/48446775/angular-how-to-change-navmenu-header-based-on-route
  }

  ngOnInit() {

  }

  // stam example
  get isAdmin() {
    return this.currentUser && this.currentUser.type === ERole.Admin;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/home']);
  }

}

