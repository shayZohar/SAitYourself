import { Component, OnInit } from '@angular/core';

import { IUser } from '@/user/interfaces/iuser';
import { HttpSignUpService } from '@/core/http/http-sign-up.service';
import { IBusiness } from '@/business/interfaces/IBusiness';

@Component({
  selector: 'home-sign-up',
  templateUrl: './home-sign-up.component.html',
  styleUrls: ['./home-sign-up.component.scss']
})
export class HomeSignUpComponent implements OnInit {

  constructor(private sinUpService: HttpSignUpService) { }

  ngOnInit() {
  }
  ///////////////////////////////////////////////////
  // function to receive input data from sign up form
  ///////////////////////////////////////////////////
  onSubmit(user: IUser ) {
    this.sinUpService.signUp(user).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log('error');
      }
    );

  }
  onSubmitBusiness(business: IBusiness) {
    this.sinUpService.signBusiness(business).subscribe(
      data => {
        console.log('business subimtted');
        console.log(data);
        // .router.navigate(['../../business'], {relativeTo: this.route});
      },
      error => {
        console.log('error');
      }
    );
  }

}
