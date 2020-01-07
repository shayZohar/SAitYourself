import { IBusiness } from './../../interfaces/IBusiness';
import { BusinessService } from '@/business/services/business.service';
import { IUser, emptyUser } from '../../../user/interfaces/iuser';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpMessagesService } from '@/core/http/http-messages.service';
import { IMessage, emptyMessage } from '@/shared/interfaces/IMessage';
import { AuthenticationService } from '@/core/authentication/authentication.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'business-contact',
  templateUrl: './business-contact.component.html',
  styleUrls: ['./business-contact.component.scss']
})
export class BusinessContactComponent implements OnInit {
   resMessages: Observable<IMessage[]>;
   senMessages: Observable<IMessage[]>;
   canEdit = true;
   messageOb: IMessage = emptyMessage();
   fName: string;
   lName: string;
   email: string;
   message: string;
   phone: string;
   currentBusiness: IBusiness;

  constructor(
    private authenticationService: AuthenticationService,
    private bService: BusinessService,
    private messageService: HttpMessagesService,
    private snackBar: MatSnackBar
  ) {}

  ////////////////////////////////////////////////////////
  // getting current user from authentication service
  // getting all of user recieved messages
  // emitting the array of messages to messages component
  ////////////////////////////////////////////////////////
  ngOnInit() {
    if (this.authenticationService.currentUserType !== 'Business Owner') {
      this.canEdit = false;
    }
    this.bService.init();

    const currentUser = this.authenticationService.currentUserValue;
    console.log('hello ' + currentUser.fName);
    this.resMessages = this.messageService.getRecievedMessages(currentUser.email);
    this.senMessages = this.messageService.getSentMessages(currentUser.email);
    // for (const item of this.resMessages) {
    //   console.log(item.messContent);
    // }
    // this.bService.updateAsRead(currentUser.email);


  }

  onSubmit() {
    this.messageOb.messContent = this.message;
    this.messageOb.senderId = this.email;
    this.messageOb.recieverId = this.bService.currentBusiness.bOwner[0];
    this.messageOb.subJect =
       `from: ${this.fName} ${this.lName} ${this.phone ? this.phone : ''}`;

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    this.messageOb.date = mm + '/' + dd + '/' + yyyy;
    this.messageService.sendMessage(this.messageOb).subscribe(
      data => {
        this.snackBar.open('Message sent successfuly!', '', {
          duration: 2000
        });
        console.log('data');
      },
      error => {
        console.log('error');
      }
    );
  }


}
