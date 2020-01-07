import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import { Observable } from "rxjs";

import { AuthenticationService } from "@/core/authentication/authentication.service";
import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { IListDemands } from "@/shared/interfaces/ilist-demands";
import { IBusiness } from "@/business/interfaces/IBusiness";

@Component({
  selector: "business-list",
  templateUrl: "./business-list.component.html",
  styleUrls: ["./business-list.component.scss"]
})
export class BusinessListComponent implements OnInit {
  @Output() chosenBusiness = new EventEmitter<IBusiness>();
  @Input() dataForList: IListDemands;
  businessListToShow$: Observable<IBusiness[]>;
  constructor(
    private httpBusiness: HttpBusinessService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.chooseList();
  }

  // AMIT helpME still need to anderstand how to choose if all businesses or just acording to email
  chooseList() {
    switch (this.dataForList.type) {
      case "Admin":
        console.log("Admin");
        break;
      case "Business Owner":
        //  this.$ =
        // this.userForList.request === "USER"
        //   // getting all the users registerd to business
        //   ? this.httpBusiness.getCurrentBusinessUsers(whatToGet)
        //   // getting all the business registerd to this owner
        //   :
        //    this.httpBusiness.getOwnedBusinesses(whatToGet);
        // break;
        this.businessListToShow$ = this.httpBusiness.getOwnedBusinesses(
          this.authService.currentUserValue.email
        );
        console.log("business list Business Owner");
        break;
      case "Client":
        console.log("Client");
        // getting all the business the user register to
        if (this.dataForList.request === "all") {
          this.businessListToShow$ = this.httpBusiness.getBusiness();
        } else {
          this.businessListToShow$ = this.httpBusiness.getRegisteredBusinesses(
            this.authService.currentUserValue.email
          );
        }
        break;
      default:
        // just for know
        break;
    }
  }

  changeBusiness(newBusiness: IBusiness) {
    if (this.dataForList.type !== "Client") {
      this.chosenBusiness.emit(newBusiness);
    }
  }

  isBusinessOwner(): boolean {
    return this.authService.currentUserValue.type === "Business Owner";
  }
}
