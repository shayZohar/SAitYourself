import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPersonalZoneComponent } from './admin-personal-zone.component';

describe('AdminPersonalZoneComponent', () => {
  let component: AdminPersonalZoneComponent;
  let fixture: ComponentFixture<AdminPersonalZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPersonalZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPersonalZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
