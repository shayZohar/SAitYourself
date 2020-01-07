import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPersonalZoneComponent } from './business-personal-zone.component';

describe('BusinessPersonalZoneComponent', () => {
  let component: BusinessPersonalZoneComponent;
  let fixture: ComponentFixture<BusinessPersonalZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessPersonalZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPersonalZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
