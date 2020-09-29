import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAppointmentComponent } from './business-appointment.component';

describe('BusinessAppointmentComponent', () => {
  let component: BusinessAppointmentComponent;
  let fixture: ComponentFixture<BusinessAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
