import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignNewBusinessComponent } from './sign-new-business.component';

describe('SignNewBusinessComponent', () => {
  let component: SignNewBusinessComponent;
  let fixture: ComponentFixture<SignNewBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignNewBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignNewBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
