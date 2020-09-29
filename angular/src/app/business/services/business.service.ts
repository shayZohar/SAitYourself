import { MatSnackBar } from "@angular/material";
import { ERole } from "@/user/interfaces/iuser";
import { Injectable } from "@angular/core";

import { HttpMessagesService } from "@/core/http/http-messages.service";
import { NavbarService } from "@/services/navbar.service";
import { INavLinks, newLink } from "@/shared/interfaces/inav-links";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { IMessage, emptyMessage } from "@/shared/interfaces/IMessage";
import { IUser } from "@/user/interfaces/iuser";
import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { IBusiness } from "@/business/interfaces/IBusiness";
import { Ihome } from "@/business/interfaces/ihome";
import { businessNavLinksList } from "@/business/business-nav-links";
import { IAbout } from "@/business/interfaces/iAbout";
import { UserService } from "@/user/services/user.service";
import { runInThisContext } from "vm";

@Injectable({
  providedIn: "root",
})
export class BusinessService {
  links: INavLinks[] = businessNavLinksList;
  businessesList: IBusiness[];
  haveBusinessesList: boolean;
  unRegisterdBusinesses: IBusiness[];
  currentBusiness: IBusiness;
  message: IMessage = emptyMessage();
  recievedMessages: IMessage[];
  recievedNumber = 0;
  sendMessages: IMessage[];
  usereRcievedMessages: IMessage[];
  userSendMessages: IMessage[];
  userRecievedNumber = 0;
  settings = "SiteSettings";

  constructor(
    private navbarService: NavbarService,
    private authenticationService: AuthenticationService,
    private messageService: HttpMessagesService,
    private userService: UserService,
    private httpBusiness: HttpBusinessService,
    private snackBar: MatSnackBar
  ) {}

  init() {
    // getting current business from function to local variable
    this.currentBusiness = this.CurrentBusiness;
    // getting current user from user service
    const user = this.authenticationService.currentUserValue;

    // check if user is an owner of the business
    const isOwner =
      user.email === ""
        ? false
        : user.token &&
          this.currentBusiness &&
          this.currentBusiness.bOwner.includes(user.email);

    // check if user is a client of the business
    const isClient =
      user.email === ""
        ? false
        : user.token &&
          this.currentBusiness &&
          this.currentBusiness.bClient.includes(user.email);
    // check if we got a businesses list
    this.haveBusinessesList =
      this.businessesList !== undefined && this.businessesList.length > 0;
    if (
      ((isClient || isOwner) && user.type !== ERole.Unsigned) ||
      user.type === ERole.Admin
    ) {
      // setting navigation bar for the business listed users or the admin
      if (isOwner) {
        this.links[2].label = "Messages";
        this.links[2].tip = `business messages`;
      } else if (this.links[2].label === "Messages") {
        this.links[2].label = "contact";
        this.links[2].tip = `contact business`;
      }
      // removing sign-up label
      this.links = this.links.filter(
        (link) => link.label.toLocaleLowerCase() !== "sign-up"
      );
    } else {
      // no business listed users and not an admin
      this.links[2].label = "Contact";
      this.links[2].tip = `contact business`;
    }

    // checking if appointment label needed
    if (
      this.currentBusiness !== undefined &&
      (this.currentBusiness.bAppointment === false || (!isClient && !isOwner))
    ) {
      // label dose not needed
      this.links = this.links.filter((link) => link.label !== "Appointments");
      if (!isClient && !isOwner && user.type !== ERole.Admin) {
        // sign-up needed
        const index = this.links.findIndex(
          (link) =>
            link.label.toLocaleLowerCase() === "contact" ||
            link.label.toLocaleLowerCase() === "messages"
        );
        if (
          user.type !== ERole.Admin &&
          ((index > -1 && this.links.length === index + 1) ||
            this.links[index + 1].label.toLocaleLowerCase() !== "sign-up")
        ) {
          // adding sign-up label
          this.createLink(
            "Sign-Up",
            ["/business/registration/sign-up"],
            index + 1,
            "sign-up to business"
          );
        }
      }
    } else {
      const index = this.links.findIndex(
        (link) =>
          link.label.toLocaleLowerCase() === "contact" ||
          link.label.toLocaleLowerCase() === "messages"
      );
      // checking if Appointments label exists
      if (index > -1) {
        if (
          this.links.length === index + 1 ||
          this.links[index + 1].label !== "Appointments"
        ) {
          this.createLink("Appointments", ["/business/appointment"], index + 1);
        }
      }
    }

    // saving links status for personal zone
    localStorage.setItem("links", "business");
    // setting if messages route is disable or not
    const seeMessages =
      (user.type === ERole.Business &&
        isOwner &&
        this.currentBusiness.ownerConnected) ||
      isClient;
    const tip =
      isOwner && user.type === ERole.User
        ? "can not see messages in Client mode"
        : "other owner is active";

    this.navbarService.canSeeMessages(seeMessages, tip);
    this.navbarService.setLinks(this.links);
    if (isOwner) {
      // if owner then get messages for business
      this.recieveMessages(this.currentBusiness.bMail);
      this.sentMessages(this.currentBusiness.bMail);
    }
  }

  /**
   * Creates a link for nav-bar
   * @param label -the link label
   * @param route - the link route
   * @param index - where to inject the link
   * @param [tip] - the tool tip to set
   */
  createLink(label: string, route: string[], index: number, tip = "") {
    const appLink = newLink();
    appLink.label = label;
    appLink.route = route;
    if (tip !== "") {
      appLink.tip = tip;
    }
    this.links.splice(index + 1, 0, appLink);
  }

  // sortin businesses array by name
  sortBusinessArrey(businesses: IBusiness[]): IBusiness[] {
    return businesses.sort((a, b) => (a.bName < b.bName ? 1 : -1));
  }

  /**
   * add a business to businesses list
   * @param business - the business to add to the list
   */
  addToBusinessesList(business: IBusiness) {
    if (this.businessesList) {
      this.businessesList.push(business);
    } else {
      this.businessesList = [business];
    }
    this.businessesList = this.sortBusinessArrey(this.businessesList);
  }

  /**
   * add a business to unregistered businesses list
   * @param business - the business to add to the list
   */
  addToUnRgisteredBusinessesList(business: IBusiness) {
    if (this.unRegisterdBusinesses) {
      this.unRegisterdBusinesses.push(business);
    } else {
      this.unRegisterdBusinesses = [business];
    }
    this.UnRegisteredBusinesses = this.unRegisterdBusinesses;
  }

  /**
   * Sets un registered businesses list
   */
  set UnRegisteredBusinesses(unregistered: IBusiness[]) {
    if (this.unRegisterdBusinesses) {
      this.unRegisterdBusinesses = this.sortBusinessArrey(unregistered);
    }
  }

  /**
   * Gets un registered businesses
   */
  get UnRegisteredBusinesses(): IBusiness[] {
    return this.unRegisterdBusinesses;
  }

  /**
   * Removes from business list
   * @param business - business to remove
   */
  removeFromBusinessList(business: IBusiness) {
    this.businessesList = this.businessesList.filter(
      (b) => b.bName !== business.bName
    );
    this.addToUnRgisteredBusinessesList(business);
    if (this.businessesList === undefined || this.businessesList.length === 0) {
      this.haveBusinessesList = false;
    }
  }

  /**
   * Changes the current business in local storage and in local variables
   * @param newBusiness - the new business to set
   */
  changeCurrentBusiness(newBusiness: IBusiness) {
    if (newBusiness !== undefined) {
      localStorage.setItem(this.settings, JSON.stringify(newBusiness));
    } else {
      localStorage.removeItem(this.settings);
    }
    this.currentBusiness = this.httpBusiness.currentBusiness = newBusiness;
  }

  /**
   * Gets current business from local storage
   */
  get CurrentBusiness(): IBusiness {
    return JSON.parse(localStorage.getItem(this.settings));
  }

  /**
   * add to business clients list
   * @param clientToAdd - client to add
   */
  addToBusinessClients(clientToAdd: IUser) {
    if (
      this.currentBusiness.bClient[0] == null ||
      this.currentBusiness.bClient[0] === ""
    ) {
      this.currentBusiness.bClient[0] = clientToAdd.email;
    } else {
      this.currentBusiness.bClient.push(clientToAdd.email);
    }
    this.changeCurrentBusiness(this.currentBusiness);
  }

  /**
   * Updates current home page
   * @param home - home object to update
   */
  updateCurrentHome(home: Ihome) {
    // tslint:disable-next-line: forin
    for (const index in home) {
      this.currentBusiness.bHome[
        index
      ] = this.httpBusiness.currentBusiness.bHome[index] = home[index];
    }
  }

  /**
   * Updates current about page
   * @param about - object to update
   */
  updateCurrentAbout(about: IAbout) {
    // tslint:disable-next-line: forin
    for (const index in about) {
      this.currentBusiness.bAbout[
        index
      ] = this.httpBusiness.currentBusiness.bAbout[index] = about[index];
    }
  }

  // call to back end
  updateHomePage(business: IBusiness) {
    const self = this;
    this.httpBusiness.updateHomePage(business).subscribe(
      (data) => {
        self.updateCurrentHome(data);
      },
      (error) => {
        this.snackBar.open(error, "", { duration: 2000 });
      }
    );
  }

  // call to back end
  updateAboutPage(business: IBusiness) {
    const self = this;
    this.httpBusiness.updateAboutPage(business).subscribe(
      (data) => {
        self.updateCurrentAbout(data);
      },
      (error) => {
        this.snackBar.open(error, "", { duration: 2000 });
      }
    );
  }

/**
 * recieve all of user messages message and count unread messages to alert
 * @param email - user's email
 */
recieveMessages(email: string) {
    const user = this.authenticationService.currentUserValue;
    this.messageService.getRecievedMessages(email).subscribe(
      (data) => {
        if (user.email === email) {
          this.usereRcievedMessages = data.filter(
            (m) => m.subJect !== "Appointment"
          );
          this.countUnread("user");
        } else {
          this.recievedMessages = data.filter(
            (m) => m.subJect !== "Appointment"
          );
          this.countUnread("business");
        }
      },
      (error) => {
        this.snackBar.open(error, "", { duration: 2000 });
      }
    );
  }

/**
 * recieve all of user sent messages
 * @param email - user's email
 */
sentMessages(email: string) {
    const user = this.authenticationService.currentUserValue;
    this.messageService.getSentMessages(email).subscribe(
      (data) => {
        if (user.email === email) {
          this.userSendMessages = data;
        } else {
          this.sendMessages = data;
        }
      },
      (error) => {
        this.snackBar.open(error, "", { duration: 2000 });
      }
    );
  }
  /**
   * count how many unread messages exists
   */
  countUnread(countFor: string) {
    let unread = 0;
    const messagesToCount =
      countFor === "user" ? this.usereRcievedMessages : this.recievedMessages;
    const reducer = (count, item) => count + (item.read === false ? 1 : 0);
    unread = messagesToCount.reduce(reducer, 0); // 0 is the initial total value

    if (countFor === "business") {
      this.recievedNumber = unread;
      this.navbarService.messageBadgeCount(this.recievedNumber);
    } else if (countFor === "user") {
      this.userRecievedNumber = unread;
      this.userService.userMessageBadgeCount(this.userRecievedNumber);
    }
  }

  /**
   * Changes message status
   * @param message - message to change
   */
  changeMessage(message: IMessage) {
    const user = this.authenticationService.currentUserValue;
    const forUser = user.email === message.recieverId;
    const recivedToChange = forUser
      ? this.usereRcievedMessages
      : this.recievedMessages;

    const index = recivedToChange.findIndex((mess) => mess.id === message.id);
    if (index !== -1) {
      if (forUser) {
        this.usereRcievedMessages[index] = message;
        this.countUnread("user");
      } else {
        this.recievedMessages[index] = message;
        this.countUnread("business");
      }
    }
  }

 /**
  * Send message
  * @param mes - message to send
  */
 sendMessage(mes: IMessage) {
    this.messageService.sendMessage(mes).subscribe(
      (data) => {},
      (error) => {
        this.snackBar.open(error, "", { duration: 2000 });
      }
    );
  }

  /**
   * Updates message as read
   * @param recId - reciever id
   */
  updateAsRead(recId: string) {
    this.messageService.setAssReadMessages(recId).subscribe(
      (data) => {},
      (error) => {
        this.snackBar.open(error, "", { duration: 2000 });
      }
    );
  }

}
