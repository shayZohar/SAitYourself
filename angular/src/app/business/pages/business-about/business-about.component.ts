import { updateAbout } from './../../interfaces/IBusiness';
import { emptyAbout } from './../../interfaces/iAbout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BusinessService } from '@/business/services/business.service';
import { IBusiness } from '@/business/interfaces/IBusiness';
import { AuthenticationService } from '@/core/authentication/authentication.service';
import { HttpMessagesService } from '@/core/http/http-messages.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'business-about',
  templateUrl: './business-about.component.html',
  styleUrls: ['./business-about.component.scss']
})
export class BusinessAboutComponent implements OnInit {
  businessToUpdate: IBusiness;
  canEdit = true;
  bAbout = emptyAbout();

  @ViewChild('editableHeader') private editableHeader;

  @ViewChild('editableSubHeader') private editableSubHeader;

  @ViewChild('editableArtical') private editableArtical;

  @ViewChild('editableAddress') private editableAddress;
  SubHeader = '';
  headerText = '';
  Artical = '';
  Address = '';
  businessName = '';

  constructor( private bService: BusinessService,
               private authenticationService: AuthenticationService,
               private messageService: HttpMessagesService,
               private router: Router,
               private route: ActivatedRoute) {
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                }

  ngOnInit() {
    // helpME shaynew
    this.bService.init();
    if (this.authenticationService.currentUserType !== 'Business Owner') {
      this.canEdit = false;
    }

    let currentBusiness: IBusiness;
    // AMIT helpME resolver: using a resolver
    const key = 'business';
    if (this.bService.currentBusiness === null) {
      this.bService.currentBusiness = currentBusiness = this.route.snapshot.data[key];
    }

    this.businessName = currentBusiness.bName;
    this.headerText = this.editableHeader.nativeElement.innerText = currentBusiness.bAbout.headerText;
    this.SubHeader = this.editableSubHeader.nativeElement.innerText = currentBusiness.bAbout.subHeaderText;
    this.Artical = this.editableArtical.nativeElement.innerText = currentBusiness.bAbout.articalText;
    this.Address = this.editableAddress.nativeElement.innerText = currentBusiness.bAbout.addressText;
  }
  saveChanges() {
    console.log('here we save the changes');
    const currentBussines = this.bService.currentBusiness;
    if (
      this.bAbout.headerText !== '' ||
      this.bAbout.subHeaderText !== '' ||
      this.bAbout.articalText !== ''
    ) {
      this.businessToUpdate = updateAbout();
      this.businessToUpdate.bMail = currentBussines.bMail;
      this.businessToUpdate.bAbout = this.bAbout;
      this.bService.updateAboutPage(this.businessToUpdate);
    }
  }
}
