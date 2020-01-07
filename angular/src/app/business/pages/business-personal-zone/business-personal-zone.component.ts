import { HttpUserService } from './../../../core/http/http-user.service';
import { BusinessService } from '@/business/services/business.service';
import { AuthenticationService } from './../../../core/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { IUser } from '@/user/interfaces/iuser';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'business-personal-zone',
  templateUrl: './business-personal-zone.component.html',
  styleUrls: ['./business-personal-zone.component.scss']
})
export class BusinessPersonalZoneComponent implements OnInit {
  currentUser: IUser;

  constructor(
    private authService: AuthenticationService,
    private httpUser: HttpUserService,
    private bService: BusinessService,
    private router: Router,
    private route: ActivatedRoute
    ) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.bService.init();
  }

}
