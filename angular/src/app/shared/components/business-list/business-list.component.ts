import { Router } from "@angular/router";
import { ERole } from "@/user/interfaces/iuser";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ViewChild,
  AfterContentInit,
  ElementRef,
} from "@angular/core";

import { Observable } from "rxjs";

import { AuthenticationService } from "@/core/authentication/authentication.service";
import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { IBusiness } from "@/business/interfaces/IBusiness";
import { BusinessService } from "@/business/services/business.service";
import { MatAutocompleteSelectedEvent } from "@angular/material";
import { timingSafeEqual } from "crypto";

@Component({
  selector: "business-list",
  templateUrl: "./business-list.component.html",
  styleUrls: ["./business-list.component.scss"],
})
export class BusinessListComponent implements OnInit, OnChanges {
  @ViewChild("businessAutoComplete") businessAutoComplete: ElementRef;

  @Output() chosenBusiness = new EventEmitter<IBusiness>();
  @Output() deleteBusiness = new EventEmitter<IBusiness>();
  @Output() browse = new EventEmitter();

  @Input() businessListToShow: IBusiness[];
  @Input() type: string;
  @Input() deleteString: string;
  filteredBusinesses: IBusiness[] = [];
  testBusiness: any;
  business: IBusiness;
  haveBusiness = true;

  constructor(
    private businessService: BusinessService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    // get current business from service
    const currentBusiness: IBusiness = this.businessService.CurrentBusiness;
    if (this.type !== "All") {
      if (
        this.businessListToShow != null &&
        this.businessListToShow.length === 1
      ) {
        this.testBusiness = this.businessListToShow[0];
        this.business = this.businessListToShow[0];
        this.changeBusiness(this.business);
      } else if (
        currentBusiness &&
        this.businessListToShow.some(
          (business) => business.bName === currentBusiness.bName
        )
      ) {
        this.business = currentBusiness;
        this.testBusiness = this.business;
        this.changeBusiness(currentBusiness);
      }
    }
    this.doFilter();
  }

  /**
   * on changes reacting to input change
   */
  ngOnChanges() {
    this.doFilter();
  }

  /**
   * navigating to the current business in storege
   */
  goToSite() {
    this.router.navigate(["/business"]);
  }

  /**
   * emiting the business to remove
   */
  removeBusiness() {
    this.deleteBusiness.emit(this.business);
    this.testBusiness = "";
    this.business = undefined;
    this.haveBusiness = true;
    this.doFilter();
  }

  /**
   * emiting the new current business to change
   * @param newBusiness - the business to emit
   */
  changeBusiness(newBusiness: IBusiness) {
    this.chosenBusiness.emit(newBusiness);
    this.haveBusiness = false;
  }

  /**
   * scetting the new business thT was selected
   * @param event - the event from mat-autocomplete
   */
  selected(event: MatAutocompleteSelectedEvent) {
    this.business = event.option.value;
    this.changeBusiness(this.business);
  }

  /**
   * Determines whether business owner is looking at this list
   * @returns true if a business owner is the one that lookes
   */
  isBusinessOwner(): boolean {
    return this.authService.currentUserValue.type === ERole.Business;
  }

  /**
   * Displays the name of the business that was selected
   * @param business - selected business
   * @returns  business name string
   */
  public displayProperty(business: IBusiness) {
    if (business) {
      return business.bName;
    }
  }

  /**
   * Do a filter of the businesses by the name inputed
   */
  doFilter() {
    if (this.testBusiness && typeof this.testBusiness === "string") {
      this.filteredBusinesses = this.businessListToShow.filter((business) =>
        business.bName.toLowerCase().includes(this.testBusiness.toLowerCase())
      );
    } else if (this.testBusiness && typeof this.testBusiness !== "string") {
      this.filteredBusinesses = this.businessListToShow.filter((business) =>
        business.bName
          .toLowerCase()
          .includes(this.testBusiness.bName.toLowerCase())
      );
    } else {
      this.filteredBusinesses = this.businessListToShow;
    }
  }
}
