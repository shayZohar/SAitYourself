import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { IUser } from "@/user/interfaces/iuser";
import { Router } from "@angular/router";
import { MatAutocompleteSelectedEvent } from "@angular/material";

@Component({
  selector: "users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.scss"],
})
export class UsersListComponent implements OnInit, OnChanges {
  @Output() remove = new EventEmitter<string>();
  @Output() block = new EventEmitter<string>();
  @Output() unBlock = new EventEmitter<string>();
  @Output() listIsSet = new EventEmitter<boolean>();
  @Output() selectedUser = new EventEmitter<IUser>();
  @Output() listLength = new EventEmitter<number>();
  @Input() usersListToShow: IUser[];
  @Input() type: string;
  @Input() placeHolder: string;
  user: IUser;
  testUser: any;
  filteredUsers: IUser[] = [];

  constructor(
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.doFilter();
  }

  ngOnChanges() {
    if (this.testUser != null) {
      this.testUser = "";
      this.doFilter();
    }
    this.listLength.emit(this.usersListToShow.length);
  }

  /**
   * emiting the user who was selected from the autocomplete
   * @param user - the selected user
   */
  selectUser(user: IUser) {
    this.selectedUser.emit(user);
  }

  /**
   * Displays the user first and last name property from the selected user
   * @param user - the selected user from autocomlete
   * @returns users firdt and last name
   */
  public displayProperty(user: IUser) {
    if (user) {
      return user.fName + " " + user.lName;
    }
  }

  /**
   * Do a filter of the users by the name inputed
   */
  doFilter() {
    if (this.testUser && typeof this.testUser === "string") {
      this.filteredUsers = this.usersListToShow.filter(
        (user) =>
          user.fName.toLowerCase().includes(this.testUser.toLowerCase()) ||
          user.fName.toLowerCase().includes(this.testUser.toLowerCase())
      );
    } else if (this.testUser && typeof this.testUser !== "string") {
      this.filteredUsers = this.usersListToShow.filter(
        (user) =>
          user.fName
            .toLowerCase()
            .includes(this.testUser.fName.toLowerCase()) ||
          user.lName.toLowerCase().includes(this.testUser.lName.toLowerCase())
      );
    } else {
      this.filteredUsers = this.usersListToShow;
    }
  }

  /**
   * getting the selected user from autoComlete selection
   * @param event - the event recived
   */
  selected(event: MatAutocompleteSelectedEvent) {
    this.user = event.option.value;
    this.selectUser(this.user);
  }
}
