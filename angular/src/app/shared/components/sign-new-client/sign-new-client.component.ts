import { EventEmitter, ViewChild } from "@angular/core";
import { Component, OnInit, Input, Output } from "@angular/core";
import {
  ControlContainer,
  NgForm,
  NgModel
} from "@angular/forms";

import { IBusiness } from "@/business/interfaces/IBusiness";
import { MatAutocompleteSelectedEvent } from "@angular/material";

@Component({
  selector: "sign-new-client",
  templateUrl: "./sign-new-client.component.html",
  styleUrls: ["./sign-new-client.component.scss"],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class SignNewClientComponent implements OnInit {
  @Output() selectedBusiness = new EventEmitter<IBusiness>();

  filteredBusinesses: IBusiness[];
  testBusiness: any;

  @ViewChild("businessVar") businessVar: NgModel;
  @Input() businesses: IBusiness[];

  constructor() { }

  ngOnInit() {
    if (this.businesses !== undefined && this.businesses.length > 1) {
      this.filteredBusinesses = this.businesses;
    } else if (this.businesses !== undefined && this.businesses.length === 1) {

      this.selectedBusiness.emit(this.businesses[0]);
    }

  }

  /**
   * filtering the businesses by the input in test business
   */
  doFilter() {
    if (this.testBusiness && typeof this.testBusiness === "string") {
      // test business is a string
      this.filteredBusinesses = this.businesses.filter(business =>
        business.bName.toLowerCase().includes(this.testBusiness.toLowerCase())
      );
    } else if (this.testBusiness && typeof this.testBusiness !== "string") {
      // test business is an business
      this.filteredBusinesses = this.businesses.filter(business =>
        business.bName
          .toLowerCase()
          .includes(this.testBusiness.bName.toLowerCase())
      );
    } else {
      // tset business is undefined
      this.filteredBusinesses = this.businesses;
    }
    this.businessVar.control.setErrors({ "not-selected": true });
  }

  /**
   * validating the business autocomlete and emminting the business
   * @param event - the event from matAuto comlete
   */
  selected(event: MatAutocompleteSelectedEvent) {
    // send to parent or do whatever you want to do
    this.businessVar.control.setErrors(null);
    this.selectedBusiness.emit(event.option.value);
  }

  /**
   * Displays the bName property frome the selected business
   * @param business - the selected business
   * @returns business name
   */
  public displayProperty(business: IBusiness) {
    if (business) {
      return business.bName;
    }
  }
}
