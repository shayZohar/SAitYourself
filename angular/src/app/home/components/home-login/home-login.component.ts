import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@/core/authentication/authentication.service';

import { IUser } from '@/user/interfaces/iuser';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BusinessService } from '@/business/services/business.service';

@Component({
  selector: 'home-login',
  templateUrl: './home-login.component.html',
  styleUrls: ['./home-login.component.scss']
})
export class HomeLoginComponent implements OnInit {
  @Output() logIn = new EventEmitter<IUser>();
  user: IUser;
  constructor(
    private logInService: AuthenticationService,
    private businessService: BusinessService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  onSubmit(user: IUser) {
    const self = this;
    this.logInService.logInUser(user.email, user.pWord).subscribe(
      data => {
        console.log(data);
        this.snackBar.open('You are logged-in successfuly', '', {
          duration: 20000
        });
        self.user = data;
        if (self.user.type === 'Business Owner') {
          // self.setBusiness(self.user.email);
          self.router.navigate(['/business']);
        } else if (self.user.type === 'Business Owner') {
          self.router.navigate(['/admin']);
        }
        // NO NEED SET TOKEN HERE
        // const token = (data as any).token;
        // localStorage.setItem("jwt", token);
      },
      error => {
        console.log('error');
      }
    );
  }
}
