import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDisplayComponent } from './business-display.component';

describe('BusinessDisplayComponent', () => {
  let component: BusinessDisplayComponent;
  let fixture: ComponentFixture<BusinessDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
