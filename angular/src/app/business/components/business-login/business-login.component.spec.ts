import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLoginComponent } from './business-login.component';

describe('BusinessLoginComponent', () => {
  let component: BusinessLoginComponent;
  let fixture: ComponentFixture<BusinessLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
