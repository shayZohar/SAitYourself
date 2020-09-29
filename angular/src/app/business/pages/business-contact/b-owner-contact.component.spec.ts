import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessContactComponent } from './business-contact.component';

describe('BusinessContactComponent', () => {
  let component: BusinessContactComponent;
  let fixture: ComponentFixture<BusinessContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
