import { Component, OnInit, Input } from "@angular/core";
import { IUser, emptyUser } from "../../interfaces/iuser";

@Component({
  selector: "user-display",
  templateUrl: "./user-display.component.html",
  styleUrls: ["./user-display.component.scss"]
})
export class UserDisplayComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input("showUser") user: IUser;
  toShow: string[];
  constructor() {}

  ngOnInit() {
    this.toShow = Object.values(this.user).slice(2);
    console.log(this.toShow);
  }
}
