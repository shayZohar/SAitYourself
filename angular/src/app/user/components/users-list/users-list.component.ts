import { BusinessService } from '@/business/services/business.service';
import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { IBusiness } from '@/business/interfaces/IBusiness';
import { IUser } from '@/user/interfaces/iuser';
import { IListDemands } from '@/shared/interfaces/ilist-demands';
import { HttpUserService } from '@/core/http/http-user.service';

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  @Input() dataForList: IListDemands;
  usersListToShow$: Observable<IUser[]>;

  constructor(
    private httpUser: HttpUserService,
    private businessService: BusinessService,
  ) { }


  ngOnInit() {
  }

   // AMIT helpME still need to anderstand how to choose if all businesses or just acording to email
   chooseList() {
    switch (this.dataForList.type) {
      case "Admin":
        console.log("Admin");
        break;
      case "Business Owner":

        // this.usersListToShow$ = this.httpUser.getUsersArray(
        //   this.businessService.currentBusiness.bClient
        // );
        console.log("business list Business Owner");
        break;
      default:
        // just for know
        break;
    }
  }

}
