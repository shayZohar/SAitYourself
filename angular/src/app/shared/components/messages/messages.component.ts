
import { Component, OnInit, Input } from '@angular/core';
import { HttpMessagesService } from '@/core/http/http-messages.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { IMessage, emptyMessage } from '@/shared/interfaces/IMessage';
import { SelectItem } from 'primeng/components/common/selectitem';

@Component({
  selector: 'sh-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  ///////////////////////////////////////
  //
  ///////////////////////////////////////

  @Input() messagesRec: IMessage[];
  @Input() messagesSent: IMessage[];
  selectedOption: string;
  sortedOption: string;
  selectedMessage: IMessage;
  // sortOptions: SelectItem[];
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
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.selectOptions = [
      { label: 'All', value: '' },
      { label: 'Read', value: '' },
      { label: 'Unread', value: '' }
    ];
    this.sortOptions = [
      { label: 'Date', value: '' },
      { label: 'Email', value: '' },

    ];
  }
  onSubmit(event: Event, message: IMessage) {
    this.messagesSent.push(message); // pushing new message to array to show
    this.displayDialog = false; // closing dialog window
    this.messageOb.messContent = this.repMessage;
    this.messageOb.senderId = message.recieverId;
    this.messageOb.recieverId = message.senderId;
    this.messageOb.subJect = 'Re: ' + message.subJect + 'date: ' +
      message.date;
    const today = new Date(); // generating date
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    this.messageOb.date = mm + '/' + dd + '/' + yyyy;
    this.messageService.sendMessage(this.messageOb).subscribe(
      data => {
        this.snackBar.open('Message sent successfuly!', '', {
          duration: 20000
        });
        console.log('data');
      },
      error => {
        console.log('error');
      }
    );
  }
  selectMessage(event: Event, message: IMessage) {
    this.selectedMessage = message;
    this.displayDialog = true;
    event.preventDefault();
  }
  onDialogHide() {
    this.selectedMessage = null;
  }
  deleteMessage(event: Event, message: IMessage) {
    // removing message from array to show
    this.messagesRec = this.messagesRec.filter(el => el !== message);
    // removing from server
    this.messageService.removeMessage(message.id).subscribe(
      data => {
        this.snackBar.open('Message deleted successfuly!', '', {
          duration: 2000
        });
        console.log('data');
      },
      error => {
        console.log('error');
      }
    );
  }
  markUnRead(event: Event, message: IMessage) {
    event.stopPropagation(); // prevent click event on parent to open the message
    if (message.read === true) {
      message.read = false;
      this.messageService.setMessageRead(message.id, 'true').subscribe(
        data => {
          this.snackBar.open('Message marked as UNREAD!', '', {
            duration: 2000
          });
        },
        error => {
          console.log('error');
        }
      );
    }
  }
  markAsRead(event: Event, message: IMessage) {
    if (message.read === false) {
      message.read = true;
      this.messageService.setMessageRead(message.id, 'false').subscribe(
        data => {
          this.snackBar.open('Message marked as READ!', '', {
            duration: 2000
          });
        },
        error => {
          console.log('error');
        }
      );
    }
  }

}
