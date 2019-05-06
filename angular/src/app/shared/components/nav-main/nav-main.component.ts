import { Component, OnInit, Input } from '@angular/core';
import { INavLinks } from '@/shared/interfaces/inav-links';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sh-nav-main',
  templateUrl: './nav-main.component.html',
  styleUrls: ['./nav-main.component.scss']
})
export class NavMainComponent implements OnInit {
      @Input() links: INavLinks[];
  constructor() { }

  ngOnInit() {
  }

}
