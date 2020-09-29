import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPersonalZoneComponent } from './client-personal-zone.component';

describe('ClientPersonalZoneComponent', () => {
  let component: ClientPersonalZoneComponent;
  let fixture: ComponentFixture<ClientPersonalZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPersonalZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPersonalZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
