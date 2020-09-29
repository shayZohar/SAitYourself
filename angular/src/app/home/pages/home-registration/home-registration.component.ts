import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../services/home.service";
import { Router } from "@angular/router";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "home-registration",
  templateUrl: "./home-registration.component.html",
  styleUrls: ["./home-registration.component.scss"],
})
export class HomeRegistrationComponent implements OnInit {
  headerText: string;

  constructor(private homeService: HomeService, private router: Router) {
    ///////////////////////////////////////
    //  forcing page to refresh - see app-routing-model
    //////////////////////////////////////
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.homeService.init();
  }

  // to know who is active and change style
  onActive(str: string) {
    if (str === "login") {
      this.headerText = "Welcome Back";
    } else {
      this.headerText = "Sign Up for Free";
    }
  }
}
