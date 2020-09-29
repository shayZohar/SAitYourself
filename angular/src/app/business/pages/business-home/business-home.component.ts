import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  HostListener,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ERole } from "@/user/interfaces/iuser";
import { HttpMessagesService } from "@/core/http/http-messages.service";
import { emptyHome } from "@/business/interfaces/ihome";
import { BusinessService } from "@/business/services/business.service";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { IBusiness, updateHome } from "@/business/interfaces/IBusiness";

@Component({
  selector: "business-home",
  templateUrl: "./business-home.component.html",
  styleUrls: ["./business-home.component.scss"],
})
export class BusinessHomeComponent implements OnInit, OnDestroy {
  bsinessToUpdat: IBusiness;
  canEdit = true;
  display: boolean;
  onEditMode = false;
  bHome = emptyHome();
  // when approaching to html from ts you write view child of the element there
  @ViewChild("editableHeader") private editableHeader;

  @ViewChild("editableSubHeader") private editableSubHeader;

  @ViewChild("editableArtical") private editableArtical;
  SubHeader = "";
  headerText = "";
  Artical = "";
  businessName = "";
  currentBusiness: IBusiness = null;
  settings = "SiteSettings";
  tempBHomeKey = "bHomeKey";

  // listening to browser refreshing
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    if (this.onEditMode) {
      sessionStorage.setItem(this.tempBHomeKey, JSON.stringify(this.bHome));
    }
  }

  constructor(
    private bService: BusinessService,
    private authenticationService: AuthenticationService,
    private messageService: HttpMessagesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    // resolver: using a resolver
    const key = "business";
    this.currentBusiness = this.bService.CurrentBusiness;
    if (this.currentBusiness == null) {
      // if Current Businnes not in storege
      this.bService.changeCurrentBusiness(
        (this.currentBusiness = this.route.snapshot.data[key])
      );
      this.currentBusiness = this.bService.CurrentBusiness;
    }

    const isOwner =
      this.authenticationService.currentUserType === ERole.Business &&
      this.currentBusiness.bOwner.includes(
        this.authenticationService.currentUserValue.email
      );
    this.bService.init();

    this.canEdit = this.currentBusiness.ownerConnected && isOwner;

    this.businessName = this.currentBusiness.bName;
    // if owner made changes in editable section without saving them,
    // reload temp changes so user do not loose them
    this.bHome = JSON.parse(sessionStorage.getItem(this.tempBHomeKey));
    if (this.bHome == null) {
      this.bHome = emptyHome();
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
    this.headerText = this.editableHeader.nativeElement.innerText = this.bHome.headerText;
    this.SubHeader = this.editableSubHeader.nativeElement.innerText = this.bHome.subHeaderText;
    this.Artical = this.editableArtical.nativeElement.innerText = this.bHome.articalText;
  }

  /**
   * no-edit accurred- if no changes where made, taking content from
   * the business object recieved from server
   */
  noEditAccurred() {
    this.headerText = this.bHome.headerText = this.editableHeader.nativeElement.innerText = this.currentBusiness.bHome.headerText;
    this.SubHeader = this.bHome.subHeaderText = this.editableSubHeader.nativeElement.innerText = this.currentBusiness.bHome.subHeaderText;
    this.Artical = this.bHome.articalText = this.editableArtical.nativeElement.innerText = this.currentBusiness.bHome.articalText;
  }

  /**
   * Saves changes- saving page content changes in the server
   */
  saveChanges() {
    const currentBussines = this.bService.currentBusiness;
    this.bsinessToUpdat = updateHome();
    this.bsinessToUpdat.bName = currentBussines.bName;
    this.bsinessToUpdat.bHome = this.bHome;
    this.bService.updateHomePage(this.bsinessToUpdat);
    this.currentBusiness.bHome = this.bService.currentBusiness.bHome = this.bHome;
    this.bService.changeCurrentBusiness(this.currentBusiness);
    this.onEditMode = false;
  }
  onEditBegin() {
    this.onEditMode = true;
  }

  /**
   * Clears changes- clearing temporary changes made by user
   */
  clearChanges() {
    this.noEditAccurred();
    sessionStorage.removeItem(this.tempBHomeKey);
    this.onEditMode = false;
  }

  /**
   * on destroy - when user leave the page, check if changes were made without saving them
   * if there are temporary changes, save them on local storage for later reload
   */
  ngOnDestroy() {
    if (this.onEditMode) {
      sessionStorage.setItem(this.tempBHomeKey, JSON.stringify(this.bHome));
    } else {
      sessionStorage.removeItem(this.tempBHomeKey);
    }
  }
}
