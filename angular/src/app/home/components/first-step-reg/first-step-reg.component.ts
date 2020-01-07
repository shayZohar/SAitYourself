import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-first-step-reg",
  templateUrl: "./first-step-reg.component.html",
  styleUrls: ["./first-step-reg.component.scss"]
})
export class FirstStepRegComponent implements OnInit {
  headerText: string;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    //  on refresh get active link
    let url: string;
    url = this.router.url;
    const urlArray: string[] = url.split("/");
    this.onActive(urlArray[urlArray.length - 1]);
  }
  // to know who is active and change style
  onActive(str: string) {
    if (str === "login") {
      this.headerText = "Welcome Back";
    } else {
      this.headerText = "Sign Up for Free";
    }
  }
  ///////////////////////////////
  // helpME navigate from code
  ///////////////////////////////
  onClick() {
    this.router.navigate(['../client'], {relativeTo: this.route});
  }
}
