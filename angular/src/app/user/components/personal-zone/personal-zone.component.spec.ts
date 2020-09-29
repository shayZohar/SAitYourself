import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalZoneComponent } from './personal-zone.component';

describe('PersonalZoneComponent', () => {
  let component: PersonalZoneComponent;
  let fixture: ComponentFixture<PersonalZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
