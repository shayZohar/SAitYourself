import { HttpBusinessService } from "./../../../core/http/http-businesses.service";
import { Component, OnInit, Input } from "@angular/core";
import { ConvertActionBindingResult } from "@angular/compiler/src/compiler_util/expression_converter";

import { BusinessService } from "@/business/services/business.service";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { HttpUserService } from "@/core/http/http-user.service";
import { Observable } from "rxjs";
import { IListDemands } from '@/shared/interfaces/ilist-demands';
import { IListDisplay } from '@/shared/interfaces/i-list-display';

@Component({
  selector: "list-to-show",
  templateUrl: "./list-to-show.component.html",
  styleUrls: ["./list-to-show.component.scss"]
})
export class ListToShowComponent implements OnInit {
  @Input() userForList: IListDemands;
  listToShow$: Observable<IListDisplay[]>;
  constructor(
    private httpUser: HttpUserService,
    private authService: AuthenticationService,
    private httpBusiness: HttpBusinessService
  ) {}

  ngOnInit() {
    console.log("here in list to show");
    this.findList();
  }
  // AMIT helpME desiding the list to use
  findList() {
    const whatToGet =
      this.userForList.request &&  this.userForList.request === "User"
        ? this.httpBusiness.currentBusiness.bName
        : this.authService.currentUserValue.email;
    switch (this.userForList.type) {
      case "Admin":
        console.log("Admin");
        break;
      case "Business Owner":
        this.listToShow$ =
          // this.userForList.request === "USER"
          //   // getting all the users registerd to business
          //   ? this.httpBusiness.getCurrentBusinessUsers(whatToGet)
          //   // getting all the business registerd to this owner
          //   :
          this.httpBusiness.getOwnedBusinesses(whatToGet);
        break;
      case "Client":
        console.log("Client");
        // getting all the business the user register to
        // this.listToShow$ = this.httpBusiness.getRegisteredBusinesses(
          // whatToGet
        // );
        break;
      default:
        // just for know
        break;
    }
  }
}
