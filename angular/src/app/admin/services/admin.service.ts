import { Injectable } from '@angular/core';

import { NavbarService } from '@/services/navbar.service';
import { INavLinks } from '@/shared/interfaces/inav-links';
import { navLinksList } from '../nav-links';
import { Router } from '@angular/router';
import { IUser } from '@/user/interfaces/iuser';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  links: INavLinks[] = navLinksList;

  constructor(
    private navbarService: NavbarService
  ) { }


  init() {
    this.navbarService.setLinks(this.links);
  }
}
