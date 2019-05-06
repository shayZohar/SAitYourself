import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'home-registration',
  templateUrl: './home-registration.component.html',
  styleUrls: ['./home-registration.component.scss']
})
export class HomeRegistrationComponent implements OnInit {

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.homeService.init();
  }

}
