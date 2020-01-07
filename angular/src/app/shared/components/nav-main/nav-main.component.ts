import { Component, OnInit, Input, AfterContentInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


import { INavLinks } from '@/shared/interfaces/inav-links';
import { IUser } from '@/user/interfaces/iuser';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sh-nav-main',
  templateUrl: './nav-main.component.html',
  styleUrls: ['./nav-main.component.scss']
})
export class NavMainComponent implements OnInit {
  //  @Input() links: INavLinks[];
  activeLink: INavLinks;
  ////////////////////////////////////////////////////////////////////////////
  // helpME to set and get for input (here:links is the name of variable)
  // set => to type script get => to html
  ////////////////////////////////////////////////////////////////////////////
  private Links: INavLinks[];

  @Input()
  currentUser: IUser;
  @Output() logOut = new EventEmitter<boolean>();

  @Input()
  set links(links: INavLinks[]) {
    if (links) {
      this.Links = links;

      //  get active link
      const url = this.router.url;
      const urlArray: string[] = url.split('/');

      // helpME:URL find current URL
      // -------------------------------
      let lastStrInUrl = urlArray[urlArray.length - 1].toLowerCase();
      lastStrInUrl = lastStrInUrl.replace(/[?].*/, '');
      const activeLinkIdx = this.links.findIndex(
        link => {
          // slice(-1)[0] gives the last element in the array - short way
          // this is instead of using [array.length - 1]
          const lastStrInLinkRoute = link.route[0].split('/').slice(-1)[0].toLowerCase();
          return lastStrInLinkRoute === lastStrInUrl;
        });
      this.activeLink = links[activeLinkIdx];
      // -------------------------------
    }
  }

  get links(): INavLinks[] {
    // transform value for display
    return this.Links;
  }
  constructor(private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.logOut.emit(true);
  }



}
