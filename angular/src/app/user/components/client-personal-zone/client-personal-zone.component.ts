import { Component, OnInit } from '@angular/core';
import { IListDemands, emptyDmands } from '@/shared/interfaces/ilist-demands';
import { AuthenticationService } from '@/core/authentication/authentication.service';

@Component({
  selector: 'client-personal-zone',
  templateUrl: './client-personal-zone.component.html',
  styleUrls: ['./client-personal-zone.component.scss']
})
export class ClientPersonalZoneComponent implements OnInit {

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
  }

  setRequest(request: string): IListDemands {
    const businessData = emptyDmands();
    businessData.request = request;
    businessData.type = this.authService.currentUserValue.type;
    return businessData;
  }
}
