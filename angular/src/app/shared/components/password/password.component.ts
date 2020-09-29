import { BusinessService } from '@/business/services/business.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sh-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  @Output() eye = new EventEmitter();

  constructor(
  ) { }

  ngOnInit() { }


  showPassword() {
    this.eye.emit("text");
  }
  coverPassword() {
    this.eye.emit("password");
  }

}
