import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstStepRegComponent } from './first-step-reg.component';

describe('FirstStepRegComponent', () => {
  let component: FirstStepRegComponent;
  let fixture: ComponentFixture<FirstStepRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstStepRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstStepRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
