import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'home-registration',
  templateUrl: './home-registration.component.html',
  styleUrls: ['./home-registration.component.scss']
})
export class HomeRegistrationComponent implements OnInit {
 headerText: string;

  constructor(private homeService: HomeService,
              private router: Router) {
              ///////////////////////////////////////
              // helpME forsing page to refresh - see app-routing-model
              //////////////////////////////////////
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
             }

  ngOnInit() {

    this.homeService.init();

    //  on refresh get active link
  //   let url: string;
  //   url = this.router.url;
  //   const urlArray: string[] = url.split('/');
  //  this.onActive(urlArray[urlArray.length - 1]);

  }
  // // to know who is active and change style
  // onActive(str: string) {
  //   if (str === 'login') { this.headerText = 'Welcome Back'; }
  //   else { this.headerText = 'Sign Up for Free'; }
  // }
  onActive(str: string) {
    if (str === "login") {
      this.headerText = "Welcome Back";
    } else {
      this.headerText = "Sign Up for Free";
    }
  }

  ///////////////////////////////
  // helpME navigate from code
  ///////////////////////////////
  // onClick() {
  //   this.router.navigate(['../client'], {relativeTo: this.route});
  // }
}
