import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

import { HttpUserService } from "@/core/http/http-user.service";
import { ERole, IUser } from "@/user/interfaces/iuser";


@Injectable({
  providedIn: "root",
})
export class UserService {
  currentClients: IUser[];
  haveClients = false;
  currentBlocked: IUser[];
  haveBlocked = false;
  currentOwners: IUser[];
  haveOwners = false;
  userUnredCount = new Subject<number>();
  allUsers: IUser[];
  haveAllUsers = false;
  userTypes: string[];
  haveTypes = false;

  constructor(
    private httpUser: HttpUserService
  ) {}

  /**
   * Determines whether uaer types have been retrieved from server
   * @returns  boolean wether user types have been retrieved or not
   */
  haveUaerTypes() {
    return (
      this.haveTypes &&
      this.userTypes !== undefined &&
      this.userTypes.length > 0
    );
  }

  /**
   * Adds an owner to ownerslist
   * @param ownerToAdd - the owner to add
   * @param currentOwner - the current active owner
   */
  addOwnerToList(ownerToAdd: IUser, currentOwner: IUser) {
    if (this.haveOwners) {
      this.haveOwners = false;
    }
    const insert =
      ownerToAdd.email !== currentOwner.email &&
      !this.currentOwners.some((owner) => owner.email === ownerToAdd.email);
    if (insert) {
      if (this.currentOwners) {
        this.currentOwners.push(ownerToAdd);
      } else {
        this.currentOwners = [ownerToAdd];
      }
    }
    this.haveOwners = true;
  }

  /**
   * Adds a client to business clients list
   * @param ClientToAdd - the client to add
   */
  addClientToList(ClientToAdd: IUser) {
    if (this.haveClients) {
      this.haveClients = false;
    }
    const insert =
      ClientToAdd.email !== ClientToAdd.email &&
      !this.currentClients.some((client) => client.email === ClientToAdd.email);
    if (insert) {
      this.currentOwners.push(ClientToAdd);
    }
    this.haveClients = true;
  }

  /**
   * Tranlates a date from ts date to a wanted format string
   * @param date - the date in ts Date format (ms)
   * @param [htmlDate] - boolean that marks if a date need to be in Html format or our format
   * true -> html format, false -> our format
   * @returns date string with the requested format
   */
  tranlateDate(date: Date, htmlDate: boolean = false): string {
    if (Date.parse(date + "") !== 0 && date.toString() !== "") {
      // not the defulte date
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
      const yyyy = date.getFullYear();
      if (htmlDate) {
        return `${yyyy}-${mm}-${dd}`;
      }
      return `${dd}/${mm}/${yyyy}`;
    }
    // defulteDate
    return "";
  }

  /**
   * Sets user birth day
   * @param birthDay - the string of the birth day
   * @returns birth day
   */
  setBirthDay(birthDay: string): number {
    if (birthDay != null && birthDay !== "") {
      const realDate = new Date(birthDay + "T00:00:00");
      return Date.parse(realDate + "");
    }
    return 0;
  }

  /**
   * Tranlates time gets a date in ts Date format (ms) and extract the time from it
   * @param date - the date to extract time from
   * @returns time string from the recived date
   */
  tranlateTime(date: Date): string {
    const hours = date.getHours();
    const min = date.getMinutes();
    return `${hours}:${min}`;
  }

  /**
   * Determines whether business clients list have been retrieved from server
   * @returns  boolean wether business clients list have been retrieved or not
   */
  checkClients(): boolean {
    return (
      this.haveClients &&
      this.currentClients !== undefined &&
      this.currentClients.length > 0
    );
  }

  /**
   * Determines whether business owners list have been retrieved from server
   * @returns  boolean wether business owners list have been retrieved or not
   */
  checkOwners(): boolean {
    return (
      this.haveOwners &&
      this.currentOwners !== undefined &&
      this.currentOwners.length > 0
    );
  }


  /**
   * Determines whether business blocked users list have been retrieved from server
   * @returns  boolean wether business blocked users list have been retrieved or not
   */
  checkBlocked(): boolean {
    return (
      this.haveBlocked &&
      this.currentBlocked !== undefined &&
      this.currentBlocked.length > 0
    );
  }

  /**
   * Determines whether all users list have been retrieved from server
   * @returns  boolean wether all users list have been retrieved or not
   */
  checkAllUsers(): boolean {
    return (
      this.haveAllUsers &&
      this.allUsers !== undefined &&
      this.allUsers.length > 0
    );
  }

  /**
   * sets users message badge count next value
   * @param unredCount - the new unread count for user personal messages
   */
  userMessageBadgeCount(unredCount: number) {
    this.userUnredCount.next(unredCount);
  }

  /**
   * Removes a client from business clients list
   * @param clientToRemove - the email of the client to remove
   */
  removeFromeClientList(clientToRemove: string) {
    if (this.haveClients) {
      this.haveClients = false;
    }
    if (this.currentClients) {
      this.currentClients = this.currentClients.filter(
        (c) => c.email != clientToRemove
      );
      if (this.currentClients.length > 0) {
        this.haveClients = true;
      }
    }
  }

  /**
   * Adds a user to business blocked list blocked list
   * @param userToBlock - the email of the user to block from business
   */
  addToBlockedList(userToBlock: string) {
    if (this.haveBlocked) {
      this.haveBlocked = false;
    }
    if (this.currentClients) {
      const user = this.currentClients.find((c) => c.email === userToBlock);
      if (user !== undefined) {
        this.removeFromeClientList(userToBlock);
        if (this.currentBlocked && this.currentBlocked.length > 0) {
          this.currentBlocked.push(user);
        } else {
          // first blocked in list
          this.currentBlocked = [user];
        }
        this.haveBlocked = true;
      }
    }
  }

  /**
   * Removes a user from business blocked list
   * @param userToUnblock - the email of the user to remove
   */
  removeFromBlockedList(userToUnblock: string) {
    this.haveBlocked = false;
    if (this.currentBlocked) {
      this.currentBlocked = this.currentBlocked.filter(
        (u) => u.email != userToUnblock
      );
      if (this.currentOwners.length > 0) {
        this.haveOwners = true;
      }
    }
  }

  /**
   * Removes an owner from business owners list
   * @param ownerToRemove - the email of the owner to remove
   */
  removeFromeOwnersList(ownerToRemove: string) {
    this.haveOwners = false;
    if (this.currentOwners) {
      this.currentOwners = this.currentOwners.filter(
        (o) => o.email != ownerToRemove
      );
      if (this.currentOwners.length > 0) {
        this.haveOwners = true;
      }
    }
  }

  /**
   * Removes a user from all users list
   * @param userToRemove - the email of the user to remove
   */
  removeFromAllUserstList(userToRemove: string) {
    this.haveAllUsers = false;
    if (this.allUsers) {
      this.allUsers = this.allUsers.filter((u) => u.email != userToRemove);
      if (this.allUsers.length > 0) {
        this.haveAllUsers = true;
      }
    }
  }

  /**
   * Sets user types in user service and sort it
   * @param types - the array of types the user have listed in data system
   */
  setUserTypes(types: string[]) {
    this.userTypes = types;
    this.userTypes.sort((one, two) => (one < two ? -1 : 1));
    if (!this.haveTypes) {
      this.haveTypes = true;
    }
  }

  /**
   * filters a type from user type list
   * @param type - the type to filter
   */
  removeType(type: string) {
    if (this.userTypes != null) {
      this.userTypes = this.userTypes.filter((t) => t !== type);
    }
  }

  /**
   * Updates last seen  field in db
   * @param userEmail - the users email that needs to be updated
   */
  updateLastSeen(userEmail: string) {
    this.httpUser.httpUpdateLastSeen(userEmail).subscribe();
  }
}
