import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSignUpComponent } from './business-sign-up.component';

describe('BusinessSignUpComponent', () => {
  let component: BusinessSignUpComponent;
  let fixture: ComponentFixture<BusinessSignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessSignUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
