import { AuthenticationService } from '@/core/authentication/authentication.service';
import { IUser, ERole } from '@/user/interfaces/iuser';
import { BusinessService } from '@/business/services/business.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'business-registration',
  templateUrl: './business-registration.component.html',
  styleUrls: ['./business-registration.component.scss']
})
export class BusinessRegistrationComponent implements OnInit {
  headerText: string;
  currentUser: IUser;
  signIn = true;
  constructor(
    private authService: AuthenticationService,
    private businessService: BusinessService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    const key = "business";
    const currentBusiness = this.businessService.CurrentBusiness;
    if (currentBusiness == null) {
      // if Current Businnes not in storege
      this.businessService.changeCurrentBusiness(
        (this.route.snapshot.data[key])
      );
    }
    const  businessToLogInTo = this.businessService.CurrentBusiness;
    const isClient = businessToLogInTo.bClient.includes(this.currentUser.email);
    const isOwner = businessToLogInTo.bOwner.includes(this.currentUser.email);
    this.signIn = !isOwner || !isClient || this.currentUser.type === ERole.Unsigned;
    this.businessService.init();
  }

  onActive(str: string) {
    if (str === "login") {
      this.headerText = "Welcome Back";
    } else {
      this.headerText = "Sign Up for Free";
    }
  }
}
