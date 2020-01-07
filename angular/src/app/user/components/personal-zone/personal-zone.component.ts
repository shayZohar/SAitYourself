import {  Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpUserService } from '@/core/http/http-user.service';
import { AuthenticationService } from '@/core/authentication/authentication.service';
import { IUser } from '@/user/interfaces/iuser';
import { startTimeRange } from '@angular/core/src/profile/wtf_impl';
import { emptyDmands, IListDemands } from '@/shared/interfaces/ilist-demands';

@Component({
  selector: 'personal-zone',
  templateUrl: './personal-zone.component.html',
  styleUrls: ['./personal-zone.component.scss']
})
export class PersonalZoneComponent implements OnInit {
  @Input() user: IUser;
  showUsers: boolean;
  usersToshow: IListDemands;
  businessesToShow: IListDemands;
  uTypes$: Observable<string[]>;
  constructor(
    private httpUser: HttpUserService,
    private authService: AuthenticationService,
    ) { }

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    this.uTypes$ = this.httpUser.getUserTypes(this.user.email);
  }
  // AMIT setting new currentUser type
  changType(type: string) {
    this.authService.currentUserType = this.user.type = type;
  }

  // buildForList(type: string) {
  //   this.businessesToShow = emptyDmands();
  //   this.businessesToShow.type = type;
  //   if ( type === "Client" ) {
  //     this.showUsers = false;
  //     this.businessesToShow.request = "USERS";
  //   } else if (type === "Business Owner") {
  //     this.businessesToShow.request = "BUSINESES";
  //     this.usersToshow = emptyDmands();
  //     this.usersToshow.request = "USERS";
  //     this.usersToshow.type = type;
  //     this.showUsers = true;
  //   }
  // }
}
