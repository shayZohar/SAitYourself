import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePersonalZoneComponent } from './home-personal-zone.component';

describe('HomePersonalZoneComponent', () => {
  let component: HomePersonalZoneComponent;
  let fixture: ComponentFixture<HomePersonalZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePersonalZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePersonalZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
