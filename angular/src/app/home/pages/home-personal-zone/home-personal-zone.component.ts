import { Component, OnInit } from '@angular/core';
import { inputs } from '@syncfusion/ej2-angular-schedule/src/recurrence-editor/recurrenceeditor.component';
import { IUser } from '@/user/interfaces/iuser';
import { AuthenticationService } from '@/core/authentication/authentication.service';

@Component({
  selector: 'home-personal-zone',
  templateUrl: './home-personal-zone.component.html',
  styleUrls: ['./home-personal-zone.component.scss']
})
export class HomePersonalZoneComponent implements OnInit {
  currentUser: IUser;
  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
  }

}
