import { IUser, emptyUser } from './../../../user/interfaces/iuser';
import { IBusiness } from './../../../business/interfaces/IBusiness';
import { AuthenticationService } from '@/core/authentication/authentication.service';
import { Component, OnInit, EventEmitter } from '@angular/core';

import { INavLinks } from '@/shared/interfaces/inav-links';
import { NavbarService } from '@/services/navbar.service';
import { navLinksList } from '@/home/nav-links';
import { HttpBusinessService } from '@/core/http/http-businesses.service';
import { EventSettingsModel } from '@syncfusion/ej2-schedule';
import { HomeService } from '@/home/services/home.service';
import { Router, ActivatedRoute, Event  } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  links: INavLinks[] = navLinksList;
  bArr: IBusiness[];
  settings = 'SiteSettings';
  u: IUser =  emptyUser();
  selected = '';
  startLogoAnim = false;
  public selectedDate: Date = new Date(2019, 6, 8);
  public eventSettings: EventSettingsModel = {
    dataSource: [
      {
        Id: 1,
        Subject: 'Explosion of Betelgeuse Star',
        StartTime: new Date(2019, 6, 8, 9, 30),
        EndTime: new Date(2019, 6, 8, 11, 0)
      }
    ]
  };

  constructor(
    private homeService: HomeService,
    private authService: AuthenticationService,
    private businessService: HttpBusinessService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.homeService.init();
    if (sessionStorage.getItem('anim')) {
      this.startLogoAnim = false;
    } else {
      this.startLogoAnim = true;
      sessionStorage.setItem('anim', 'logoAnimated');
    }
    if (this.authService.currentUser) {
      console.log(this.authService.currentUser);
    }
    this.businessService.getBusiness().subscribe(
      data => {
        console.log(data, data.length);

        this.bArr = data;

        for (const item of this.bArr) {
          console.log(item.bName);
        }
      },
      error => {
        console.log('im here in error home component');
        console.log(typeof error);
      }
    );
  }

  goToSite(event: Event, b: IBusiness) {
    // helpME shaynew
    const self = this;
    self.businessService.currentBusiness = b;
    this.u.type = 'Client';
    self.authService.currentUserValue = this.u;
    console.log(this.authService.currentUserValue);
    sessionStorage.removeItem(this.settings);
    sessionStorage.setItem(this.settings, JSON.stringify(b));
    self.router.navigate(['/business']);
  }
}
