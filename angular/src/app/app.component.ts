import { AuthenticationService } from "@/core/authentication/authentication.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouterEvent,
} from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  realName = "shay the putzy";

  loading = true; // if loading, spinner will be visible
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.router.events.subscribe((e: RouterEvent) => {
      this.checkRouterEvent(e);
    });
  }
  /////////////////////////////////////////////////////////////////////////////////
  // always scroll to top when refresgh or new route
  //////////////////////////////////////////////////////////////////////////////////
  ngOnInit() {
    //  scroll to top on route change
    // register a route change listener on main component and scroll to top on route changes.
    this.router.events.subscribe((evt: RouterEvent) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
  //////////////////////////////////////////////////////////////////////////////////
  // check if spinner has to be visible
  //////////////////////////////////////////////////////////////////////////////////
  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    } else if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.loading = false;
    }
  }

  /**
   * when closing the browser, clearing data accordinely
   */
  ngOnDestroy() {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser != null) {
      this.authService.logout();
      localStorage.removeItem("links");
    }
  }
}
