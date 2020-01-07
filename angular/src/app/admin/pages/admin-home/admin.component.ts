import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { HttpUserService } from '@/core/http/http-user.service';
import { IUser, emptyUser } from '@/user/interfaces/iuser';
import { NavbarService } from '@/services/navbar.service';
import { navLinksList } from '@/admin/nav-links';
import { AdminService } from '@/admin/services/admin.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  @Output() askForUser = new EventEmitter<IUser>();
  user: IUser;
  constructor(private userService: HttpUserService,
              private adminService: AdminService) {
   }


  ngOnInit() {
    this.adminService.init();

    // ?????????????????
    this.userService.getUser('shayzohar8@gmail.com').subscribe(
      data => {
        console.log(data);
        this.user = data;
      },
      error => {
        console.log('error');
      }
    );
  }


}

