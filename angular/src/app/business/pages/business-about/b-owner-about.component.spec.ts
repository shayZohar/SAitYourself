import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAboutComponent } from './business-about.component';

describe('BusinessAboutComponent', () => {
  let component: BusinessAboutComponent;
  let fixture: ComponentFixture<BusinessAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
