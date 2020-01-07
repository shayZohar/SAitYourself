import { ERole } from './../../../user/interfaces/iuser';
import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { createOfflineCompileUrlResolver } from '@angular/compiler';

import { Data } from '@syncfusion/ej2-schedule/src/schedule/actions/data';

import { HttpMessagesService } from '@/core/http/http-messages.service';
import { defaultHomeVal, Ihome, emptyHome } from '@/business/interfaces/ihome';
import { BusinessService } from '@/business/services/business.service';
import { AuthenticationService } from '@/core/authentication/authentication.service';
import { IBusiness, updateHome } from '@/business/interfaces/IBusiness';
import { UserModule } from '@/user/user.module';

@Component({
  selector: 'business-home',
  templateUrl: './business-home.component.html',
  styleUrls: ['./business-home.component.scss']
})
export class BusinessHomeComponent implements OnInit {
  // AMIT
  bsinessToUpdat: IBusiness;
  canEdit = true;
  edit = true;

  bHome = emptyHome();
 // when approaching to html from ts you write view child of the element there
  @ViewChild('editableHeader') private editableHeader;

  @ViewChild('editableSubHeader') private editableSubHeader;

  @ViewChild('editableArtical') private editableArtical;
  SubHeader = '';
  headerText = '';
  Artical = '';
  businessName = '';
  currentBusiness: IBusiness = null;
  settings = 'SiteSettings';
  ///////////////////////////////////////////////////
  // helpME output the result of getting list of recieved messages
  ///////////////////////////////////////////////////
  // @Output() resMessages = new EventEmitter<IMessage[]>();
  // @Output() senMessages = new EventEmitter<IMessage[]>();

  // tslint:disable-next-line: max-line-length
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
    if (this.authenticationService.currentUserType !== ERole.Business) {
      this.canEdit = false;
    }

    // AMIT helpME resolver: using a resolver

    // helpME shaynew
    const key = 'business';
    const data = JSON.parse(sessionStorage.getItem(this.settings));
    if (data === null) {
      this.currentBusiness = this.route.snapshot.data[key];
      sessionStorage.removeItem(this.settings);
      sessionStorage.setItem(this.settings, JSON.stringify(this.currentBusiness));
    }
    this.bService.init();
    this.currentBusiness = this.bService.currentBusiness = JSON.parse(sessionStorage.getItem(this.settings));
    // AMIT
    this.businessName = this.currentBusiness.bName;
    this.headerText = this.editableHeader.nativeElement.innerText = this.currentBusiness.bHome.headerText;
    this.SubHeader = this.editableSubHeader.nativeElement.innerText = this.currentBusiness.bHome.subHeaderText;
    this.Artical = this.editableArtical.nativeElement.innerText = this.currentBusiness.bHome.articalText;
  }

  // AMIT
  /**
   * Saves canges is a function to change the values that had been chaned
   */
  saveChanges() {
    console.log('here we save the changes');
    const currentBussines = this.bService.currentBusiness;
    if (
      this.bHome.headerText !== '' ||
      this.bHome.subHeaderText !== '' ||
      this.bHome.articalText !== ''
    ) {
      // need to change at least one of home paramiters
      this.bsinessToUpdat = updateHome();
      this.bsinessToUpdat.bMail = currentBussines.bMail;
      // AMIT NOT FINISHED need to see were to update
      this.bsinessToUpdat.bHome = this.bHome;
      this.bService.updateHomePage(this.bsinessToUpdat);
    }
  }
}
