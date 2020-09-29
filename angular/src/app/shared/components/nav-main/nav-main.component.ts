import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { NavbarService } from "@/services/navbar.service";
import { BusinessService } from "@/business/services/business.service";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { INavLinks, newLink } from "@/shared/interfaces/inav-links";
import { IUser } from "@/user/interfaces/iuser";
import { Subscription } from "rxjs";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "sh-nav-main",
  templateUrl: "./nav-main.component.html",
  styleUrls: ["./nav-main.component.scss"],
})
export class NavMainComponent implements OnInit, OnDestroy {
  activeLink: INavLinks;
  private Links: INavLinks[] = [];
  unredCount = 0;
  private unredCountSub: Subscription;
  canSeeMessages = false;
  private canSeeMessagesSub: Subscription;
  messageDisabledTip = "";
  private messageDisabledTipSub: Subscription;

  @Input()
  currentUser: IUser;
  @Output() logOut = new EventEmitter<boolean>();

  urlArray: string[];
  @Input()
  set links(links: INavLinks[]) {
    if (links) {
      this.Links = links;

      this.messageIndex = this.links.findIndex(
        (link) =>
          link.label.toLowerCase() === "messages" ||
          link.label.toLowerCase() === "contact"
      );
    }
  }
  get links(): INavLinks[] {
    // transform value for display
    return this.Links;
  }
  messageIndex = 1;

  constructor(
    private navBarService: NavbarService,
    private businessService: BusinessService,
    private httpBusiness: HttpBusinessService,
    private router: Router,
  ) {}

  /**
   * on init - subscribing to all of the component subjects
   */
  ngOnInit() {
    this.unredCountSub = this.navBarService.unredCount.subscribe((data) => {
      this.unredCount = data;
    });

    this.canSeeMessagesSub = this.navBarService.seeMessages.subscribe(
      (data) => {
        this.canSeeMessages = data;
      }
    );

    this.messageDisabledTipSub = this.navBarService.messageTip.subscribe(
      (data) => {
        this.messageDisabledTip = data;
      }
    );
  }

  /**
   * emiting current user loging out from the system
   */
  logout() {
    this.logOut.emit(true);
  }

  /**
   * Sets a new link and check if active
   * @param selectedRoute - the rout for the link
   * @returns boolean if active this link is activ or not
   */
  setActive(selectedRoute: string): boolean {
    const link = newLink();
    link.route.push(selectedRoute);
    return this.isActive(link);
  }

  /**
   * Navigates to main home page
   */
  navigateHome() {
    const currentBusiness = this.businessService.CurrentBusiness;
    if (currentBusiness != null && currentBusiness.ownerConnected === true) {
      this.httpBusiness
        .httpUpdateBoolFields(false, currentBusiness.bName, "OwnerConnected")
        .subscribe();
    }
    this.businessService.changeCurrentBusiness(undefined);
    this.router.navigate(["/home"]);
  }

  /**
   * Determines whether the link is active or not active is
   * @param link - the link to check
   * @returns boolean if link is active or not
   */
  isActive(link: INavLinks) {
    if (this.router.url == link.route[0]) {
      return true;
    }
    if (
      (this.router.url.includes("sign-up") ||
        this.router.url.includes("login")) &&
      link.label === "Login"
    ) {
      return true;
    }
    return false;
  }

  /**
   * on destroy unsubscribing from subjects
   */
  ngOnDestroy(): void {
    this.unredCountSub.unsubscribe();
    this.canSeeMessagesSub.unsubscribe();
    this.messageDisabledTipSub.unsubscribe();
  }
}
