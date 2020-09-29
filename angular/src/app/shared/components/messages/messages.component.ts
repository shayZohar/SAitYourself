import { AuthenticationService } from '@/core/authentication/authentication.service';
import { BusinessService } from '@/business/services/business.service';

import { Component, OnInit, Input, OnChanges, AfterContentInit } from '@angular/core';
import { HttpMessagesService } from '@/core/http/http-messages.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { IMessage, emptyMessage } from '@/shared/interfaces/IMessage';
import { SelectItem } from 'primeng/components/common/selectitem';

@Component({
  selector: 'sh-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnChanges {

  @Input() messagesRec: IMessage[];
  @Input() messagesSent: IMessage[];
  @Input() messageFor: string;
  messageRecSelectedShow: IMessage[];
  messageSentSelectedShow: IMessage[];
  selectedOption: string;
  sortedOption: string;
  selectedMessage: IMessage;
  displayDialog: boolean;
  sortKey: string;
  sortField: string;
  sortOrder: number;
  messId: string;
  // for the reply message
  messageOb: IMessage = emptyMessage();
  email: string;
  repMessage: string;
  phone: string;
  received = true;
  selectOptions: SelectItem[];
  sortOptions: SelectItem[];

  constructor(
    private messageService: HttpMessagesService,
    private businessService: BusinessService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    // initial values and labels for message management
    this.selectOptions = [
      { label: 'All', value: '0' },
      { label: 'Read', value: 'true' },
      { label: 'Unread', value: 'false' }
    ];
    this.sortOptions = [
      { label: 'Date', value: 'date' },
      { label: 'Email', value: 'email' },

    ];
  }

  /**
   * on changes of the input, to view corrent data
   */
  ngOnChanges() {
    if (this.messagesRec != null) {
      this.messagesRec = this.messagesRec.filter(mess => mess.subJect !== 'Appointment');
      this.businessService.countUnread(this.messageFor);
    }
    if (this.messagesSent != null ) {
    this.messagesSent = this.messagesSent.filter(mess => mess.subJect !== 'Appointment');
    this.businessService.countUnread(this.messageFor);
    }
    this.messageRecSelectedShow = this.messagesRec;
    this.messageSentSelectedShow = this.messagesSent;
  }

  /**
   * when selected option changed on, filter data accordinly
   */
  onSelectedOptionChanged() {
    let flag = false;
    this.messageRecSelectedShow = this.messagesRec;
    flag = this.selectedOption === 'true' ? true : false;
    if (this.selectedOption !== '0') {
      this.messageRecSelectedShow = this.messagesRec.filter(x => x.read === flag);
    }
  }

  /**
   * when sort option changed on, sort data accordinly
   */
  onSortOptionChanged(recievedMessages: string = 'false') {
    this.messageRecSelectedShow = JSON.parse(JSON.stringify(this.messagesRec));
    this.messageSentSelectedShow = JSON.parse(JSON.stringify(this.messagesSent));
    if (this.sortedOption === 'email') {
      recievedMessages === 'true' ?
       this.messageRecSelectedShow.sort(this.compareRecieved) : this.messageSentSelectedShow.sort(this.compareSent);
    }
  }
  /**
   * Compares recieved messages to sort by sender name
   * @param a - first object
   * @param b -second object
   * @returns  1,-1, 0 to sort accordingly
   */
  compareRecieved( a: IMessage, b: IMessage) {
    if ( a.senderId < b.senderId ) {
      return -1;
    }
    if ( a.senderId > b.senderId ) {
      return 1;
    }
    return 0;
  }

  /**
   * Compares sent messages to sort by reciever name
   * @param a - first object
   * @param b -second object
   * @returns  1,-1, 0 to sort accordingly
   */
  compareSent( a: IMessage, b: IMessage) {
    if ( a.recieverId < b.recieverId ) {
      return -1;
    }
    if ( a.recieverId > b.recieverId ) {
      return 1;
    }
    return 0;
  }

  /**
   * when sending a message
   * @param message - message to send
   */
  onSubmit( message: IMessage) {
    this.messagesSent.push(message); // pushing new message to array to show
    this.displayDialog = false; // closing dialog window
    this.messageOb.messContent = this.repMessage;
    this.messageOb.senderId = message.recieverId;
    this.messageOb.recieverId = message.senderId;
    this.messageOb.subJect = 'Re: ' + message.subJect + ' date: ' +
      message.date;
    const today = new Date(); // generating date
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    this.messageOb.date = mm + '/' + dd + '/' + yyyy;
    this.messageService.sendMessage(this.messageOb).subscribe(
      data => {
        this.snackBar.open('Message sent successfuly!', '', {
          duration: 2000
        });
      },
      error => {
        this.snackBar.open(error, "" , { duration: 3000});
      }
    );
  }

  /**
   * Selects message
   * @param event - event that happened
   * @param message - selected message
   */
  selectMessage(event: Event, message: IMessage) {
    this.selectedMessage = message;
    this.displayDialog = true;
    event.preventDefault();
  }

  /**
   * hiding dialog
   */
  onDialogHide() {
    this.selectedMessage = null;
  }

  /**
   * Deletes message
   * @param message - the message to delete
   */
  deleteMessage( message: IMessage) {
    const self = this;
    // removing from server
    this.messageService.removeMessage(message.id).subscribe(
      data => {
        self.snackBar.open('Message deleted successfuly!', '', {
          duration: 2000
        });
        // removing message from array to show
        self.messageRecSelectedShow = self.messageRecSelectedShow.filter(el => el !== message);
        self.businessService.countUnread(this.messageFor);
      },
      error => {
        self.snackBar.open(error, "" , { duration: 3000});
      }
    );
  }

  /**
   * Marks message as unread
   * @param event  - event that happened
   * @param message - message to manipulate
   */
  markUnRead(event: Event, message: IMessage) {
    event.stopPropagation(); // prevent click event on parent to open the message
    if (message.read === true) {
      message.read = false;
      this.messageService.setMessageRead(message.id, 'true').subscribe(
        data => {
          this.snackBar.open('Message marked as UNREAD!', '', {
            duration: 2000
          });

          this.businessService.changeMessage(message);
        },
        error => {
          this.snackBar.open(error, "" , { duration: 3000});
        }
      );
    }
  }

  /**
   * Marks message as read
   * @param event  - event that happened
   * @param message - message to manipulate
   */
  markAsRead(event: Event, message: IMessage) {
    const self = this;
    if (message.read === false) {
      message.read = true;
      this.messageService.setMessageRead(message.id, 'false').subscribe(
        data => {
          this.snackBar.open('message marked as read', '', {
            duration: 2000
          });
          this.businessService.changeMessage(message);
        },
        error => {
          self.snackBar.open(error, "" , { duration: 3000});
        }
      );
    }
  }
}
