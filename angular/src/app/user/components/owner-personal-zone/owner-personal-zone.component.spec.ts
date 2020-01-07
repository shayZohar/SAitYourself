import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerPersonalZoneComponent } from './owner-personal-zone.component';

describe('OwnerPersonalZoneComponent', () => {
  let component: OwnerPersonalZoneComponent;
  let fixture: ComponentFixture<OwnerPersonalZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerPersonalZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerPersonalZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
