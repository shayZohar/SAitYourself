import { Component, OnInit } from '@angular/core';

import { INavLinks } from '@/shared/interfaces/inav-links';
import { NavbarService } from '@/services/navbar.service';
import { navLinksList } from '@/modules/home/nav-links';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  links: INavLinks[] = navLinksList;

  constructor(private navbarService: NavbarService) { }

  ngOnInit() {
      this.navbarService.setLinks(this.links);
  }

}
