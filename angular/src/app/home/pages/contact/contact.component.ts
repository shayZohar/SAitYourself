import { IMessage, emptyMessage } from './../../../shared/interfaces/IMessage';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { INavLinks } from '@/shared/interfaces/inav-links';
import { navLinksList } from '@/home/nav-links';
import { HomeService } from '@/home/services/home.service';
import { HttpMessagesService } from '@/core/http/http-messages.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  messageOb: IMessage = emptyMessage();
  links: INavLinks[] = navLinksList;
  fName: string;
  lName: string;
  email: string;
  message: string;
  phone: string;
  constructor(
    private homeService: HomeService,
    private messageService: HttpMessagesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.homeService.init();
  }
  onSubmit() {
    // do an interface of message and send it with emmiter
    this.messageOb.messContent = this.message;
    this.messageOb.senderId = this.email;
    // this.messageOb.recieverId = 'amit@gmail.com';
    this.messageOb.subJect =
       `from: ${this.fName} ${this.lName} ${this.phone ? this.phone : ''}`;

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    this.messageOb.date = mm + '/' + dd + '/' + yyyy;
    // console.log('date is: ' + this.messageOb.date);
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
