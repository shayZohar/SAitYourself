import { browser } from "protractor";
import { UserService } from "@/user/services/user.service";
import { ERole } from "@/user/interfaces/iuser";

import { emptyAbout, IAbout } from "@/business/interfaces/iAbout";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  HostListener,
} from "@angular/core";
import { BusinessService } from "@/business/services/business.service";
import { IBusiness, updateAbout } from "@/business/interfaces/IBusiness";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { HttpMessagesService } from "@/core/http/http-messages.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "business-about",
  templateUrl: "./business-about.component.html",
  styleUrls: ["./business-about.component.scss"],
})
export class BusinessAboutComponent implements OnInit, OnDestroy {
  businessToUpdate: IBusiness;
  canEdit = true;
  display: boolean;
  onEditMode = false;
  tempBAboutKey = "bAboutKey";
  bAbout: IAbout;
  settings = "SiteSettings";

  @ViewChild("editableHeader") private editableHeader;

  @ViewChild("editableSubHeader") private editableSubHeader;

  @ViewChild("editableArtical") private editableArtical;

  @ViewChild("editableAddress") private editableAddress;

  SubHeader = "";
  headerText = "";
  Artical = "";
  Address = "";
  businessName = "";
  currentBusiness: IBusiness = null;

  // listenning to browser reloaded
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    if (this.onEditMode) {
      sessionStorage.setItem(this.tempBAboutKey, JSON.stringify(this.bAbout));
    }
  }

  constructor(
    private bService: BusinessService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    const key = "business";

    // getting business object from service
    this.currentBusiness = this.bService.CurrentBusiness;
    if (this.currentBusiness == null) {
      // if no business found in service. get it from resolver
      this.bService.changeCurrentBusiness(
        (this.currentBusiness = this.route.snapshot.data[key])
      );
      this.currentBusiness = this.bService.CurrentBusiness;
    }

    this.businessName = this.currentBusiness.bName;
    // checking if current user is the owner of the site and if in owner mode
    const isOwner =
      this.authenticationService.currentUserType === ERole.Business &&
      this.currentBusiness.bOwner.includes(
        this.authenticationService.currentUserValue.email
      );
    this.bService.init();
    // check if owner can edit the site
    this.canEdit = this.currentBusiness.ownerConnected && isOwner;

    // if owner made changes in editable section without saving them,
    // reload temp changes so user do not loose them
    this.bAbout = JSON.parse(sessionStorage.getItem(this.tempBAboutKey));
    if (this.bAbout == null) {
      this.bAbout = emptyAbout();
      this.noEditAccurred();
    } else {
      this.editAccurred();
    }
  }

  showDialog() {
    this.display = true;
  }

  /**
   * Edits accurred- user started making changes on content of the page
   */
  editAccurred() {
    this.onEditMode = true;
    this.headerText = this.editableHeader.nativeElement.innerText = this.bAbout.headerText;
    this.SubHeader = this.editableSubHeader.nativeElement.innerText = this.bAbout.subHeaderText;
    this.Artical = this.editableArtical.nativeElement.innerText = this.bAbout.articalText;
    this.Address = this.editableAddress.nativeElement.innerText = this.bAbout.addressText;
  }

  /**
   * no-edit accurred- if no changes where made, taking content from
   * the business object recieved from server
   */
  noEditAccurred() {
    this.headerText = this.bAbout.headerText = this.editableHeader.nativeElement.innerText = this.currentBusiness.bAbout.headerText;
    this.SubHeader = this.bAbout.subHeaderText = this.editableSubHeader.nativeElement.innerText = this.currentBusiness.bAbout.subHeaderText;
    this.Artical = this.bAbout.articalText = this.editableArtical.nativeElement.innerText = this.currentBusiness.bAbout.articalText;
    this.Address = this.bAbout.addressText = this.editableAddress.nativeElement.innerText = this.currentBusiness.bAbout.addressText;
  }

  /**
   * Saves changes- saving page content changes in the server
   */
  saveChanges() {

    const currentBussines = this.bService.CurrentBusiness;
    if (currentBussines) {
      this.businessToUpdate = updateAbout();
      this.businessToUpdate.bName = currentBussines.bName;

      this.businessToUpdate.bAbout = this.bAbout;
      this.bService.updateAboutPage(this.businessToUpdate);
      this.currentBusiness.bAbout = this.bService.currentBusiness.bAbout = this.bAbout;
      this.bService.changeCurrentBusiness(this.currentBusiness);
      this.onEditMode = false;
    }
  }

  /**
   * Clears changes- clearing temporary changes made by user
   */
  clearChanges() {
    this.noEditAccurred();
    sessionStorage.removeItem(this.tempBAboutKey);
    this.onEditMode = false;
  }

  /**
   * on destroy - when user leave the page, check if changes were made without saving them
   * if there are temporary changes, save them on local storage for later reload
   */
  ngOnDestroy() {
    if (this.onEditMode) {
      sessionStorage.setItem(this.tempBAboutKey, JSON.stringify(this.bAbout));
    } else {
      sessionStorage.removeItem(this.tempBAboutKey);
    }
  }
}
