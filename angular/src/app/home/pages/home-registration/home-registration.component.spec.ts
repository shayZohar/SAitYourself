import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRegistrationComponent } from './home-registration.component';

describe('HomeRegistrationComponent', () => {
  let component: HomeRegistrationComponent;
  let fixture: ComponentFixture<HomeRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
