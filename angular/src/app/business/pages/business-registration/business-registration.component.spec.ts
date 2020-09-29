import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRegistrationComponent } from './business-registration.component';

describe('BusinessRegistrationComponent', () => {
  let component: BusinessRegistrationComponent;
  let fixture: ComponentFixture<BusinessRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
