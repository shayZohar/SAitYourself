import { IBusiness } from './../../../business/interfaces/IBusiness';
import { Component, OnInit } from '@angular/core';

import { IListDemands, emptyDmands } from '@/shared/interfaces/ilist-demands';
import { AuthenticationService } from '@/core/authentication/authentication.service';
import { BusinessService } from '@/business/services/business.service';

@Component({
  selector: 'owner-personal-zone',
  templateUrl: './owner-personal-zone.component.html',
  styleUrls: ['./owner-personal-zone.component.scss']
})
export class OwnerPersonalZoneComponent implements OnInit {
  showClients = false;
  userData: IListDemands;

  constructor(
    private authService: AuthenticationService,
    // AMIT question: ask tania if correct to us business service here
    private businessService: BusinessService
  ) { }

  ngOnInit() {
  }
  setRequest(request: string): IListDemands {
    const requestData = emptyDmands();
    if (request === "Owner") {
      requestData.request = request;
    } else if (request === "Business") {
      requestData.request = request;
    }
    requestData.type = this.authService.currentUserValue.type;
    return requestData;
  }

  changeCurrentBusiness(business: IBusiness) {
    // check if no business was selected
    if (!this.showClients) {
      this.showClients = true;
    }
    this.businessService.changeCurrentBusiness(business);

  }
}
