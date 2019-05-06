import { Injectable } from '@angular/core';

import { NavbarService } from '@/services/navbar.service';
import { INavLinks } from '@/shared/interfaces/inav-links';
import { navLinksList } from '../nav-links';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  links: INavLinks[] = navLinksList;

  constructor(private navbarService: NavbarService) { }

  init() {
    this.navbarService.setLinks(this.links);

    }
}
