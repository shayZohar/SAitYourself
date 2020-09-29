import { ERole } from '@/user/interfaces/iuser';
import { IBusiness } from "@/business/interfaces/IBusiness";
import { BusinessService } from "@/business/services/business.service";
import { Component, OnInit} from "@angular/core";
import { HttpMessagesService } from "@/core/http/http-messages.service";
import { IMessage, emptyMessage } from "@/shared/interfaces/IMessage";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "business-contact",
  templateUrl: "./business-contact.component.html",
  styleUrls: ["./business-contact.component.scss"]
})
export class BusinessContactComponent implements OnInit {
  resMessages: Observable<IMessage[]>;
  senMessages: Observable<IMessage[]>;
  canEdit = true;
  messageOb: IMessage = emptyMessage();
  fName: string;
  lName: string;
  email: string;
  editPDetails: boolean;
  message: string;
  phone: string;
  isClient: boolean;
  isOwner: boolean;
  currentBusiness: IBusiness;

  constructor(
    private authenticationService: AuthenticationService,
    private bService: BusinessService,
    private messageService: HttpMessagesService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ////////////////////////////////////////////////////////
  // getting current user from authentication service
  // getting all of user recieved messages
  // emitting the array of messages to messages component
  ////////////////////////////////////////////////////////
  ngOnInit() {
    const key = "business";
    const currentUser = this.authenticationService.currentUserValue;
    // getting business object from service
    this.currentBusiness = this.bService.CurrentBusiness;
    if (this.currentBusiness == null) {
      // if no business found in service. get it from resolver
      this.bService.changeCurrentBusiness(this.route.snapshot.data[key]);
      this.currentBusiness = this.bService.CurrentBusiness;
    }
    const type = currentUser.type;
    this.isOwner = type !== ERole.Business ? false : this.currentBusiness.bOwner.includes(currentUser.email);
    this.isClient = type !== ERole.User ? false : this.currentBusiness.bClient.includes(currentUser.email);
    this.canEdit = this.isOwner && this.currentBusiness.ownerConnected;
    if (this.isOwner) {
      // business owner - getting messages for business
      const email = this.currentBusiness.bMail;
      this.resMessages = this.messageService.getRecievedMessages(email);
      this.senMessages = this.messageService.getSentMessages(email);
    } else if (currentUser.type !== ERole.Unsigned) {
      // not business owner - setting the values of the business
      this.fName = currentUser.fName;
      this.lName = currentUser.lName;
      this.email = currentUser.email;
      this.editPDetails = false;
    } else {
      this.editPDetails = true;
    }
    this.bService.init();
  }

  /**
   * send message to business
   */
  onSubmit() {
    this.messageOb.messContent = this.message;
    this.messageOb.senderId = this.email;
    this.messageOb.recieverId = this.bService.currentBusiness.bMail;
    this.messageOb.subJect = `from: ${this.fName} ${this.lName} ${
      this.phone ? this.phone : ""
    }`;

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = today.getFullYear();

    this.messageOb.date = mm + "/" + dd + "/" + yyyy;
    this.messageService.sendMessage(this.messageOb).subscribe(
      data => {
        this.snackBar.open("Message sent successfuly!", "", {
          duration: 2000
        });
      },
      error => {
        this.snackBar.open(error, "", {duration: 3000});
      }
    );
  }
}
