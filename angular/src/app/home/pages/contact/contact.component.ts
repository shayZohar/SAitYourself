import { IUser } from '@/user/interfaces/iuser';
import { IMessage, emptyMessage } from '@/shared/interfaces/IMessage';
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
  editPDetails: boolean;
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
    const currentUser: IUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      this.fName = currentUser.fName;
      this.lName = currentUser.lName;
      this.email = currentUser.email;
      this.editPDetails = false;
    } else {
      this.editPDetails = true;
    }
  }
  onSubmit() {
    // do an interface of message and send it with emmiter
    this.messageOb.messContent = this.message;
    this.messageOb.senderId = this.email;
    this.messageOb.subJect =
       `from: ${this.fName} ${this.lName} ${this.phone ? this.phone : ''}`;
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    this.messageOb.date = mm + '/' + dd + '/' + yyyy;
    // sending the message
    this.messageService.sendMessage(this.messageOb).subscribe(
      data => {
        this.snackBar.open('Message sent successfully!', '', {
          duration: 2000
        });
      },
      error => {
        this.snackBar.open(error, "" , { duration: 3000});
      }
    );
  }
}
