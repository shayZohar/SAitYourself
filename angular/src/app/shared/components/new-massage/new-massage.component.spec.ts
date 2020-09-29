import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMassageComponent } from './new-massage.component';

describe('NewMassageComponent', () => {
  let component: NewMassageComponent;
  let fixture: ComponentFixture<NewMassageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMassageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
