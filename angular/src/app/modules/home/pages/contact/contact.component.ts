import { Component, OnInit } from '@angular/core';

import { INavLinks } from '@/shared/interfaces/inav-links';
import { navLinksList } from '@/modules/home/nav-links';
import { HomeService } from '@/modules/home/services/home.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  links: INavLinks[] = navLinksList;


  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.homeService.init();
  }

}
