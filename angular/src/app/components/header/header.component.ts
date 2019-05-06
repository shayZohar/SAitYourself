import { Component, OnInit, Input } from '@angular/core';

import { INavLinks } from '@/shared/interfaces/inav-links';
import { NavbarService } from '@/services/navbar.service';

import { from } from 'rxjs';

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


  
  constructor(private navbarService: NavbarService) {
    // on any change of links, this links will be updated
    this.navbarService.getLinks().subscribe(value => this.links = value);

    //router.events.subscribe( (event) => ( event instanceof NavigationEnd ) && this.handleRouteChange() )
    //How to change navmenu header based on route
    //https://stackoverflow.com/questions/48446775/angular-how-to-change-navmenu-header-based-on-route
  }

  ngOnInit() {
  }

}

