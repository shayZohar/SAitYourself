import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignNewClientComponent } from './sign-new-client.component';

describe('SignNewClientComponent', () => {
  let component: SignNewClientComponent;
  let fixture: ComponentFixture<SignNewClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignNewClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignNewClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
