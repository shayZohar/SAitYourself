import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListToShowComponent } from './list-to-show.component';

describe('ListToShowComponent', () => {
  let component: ListToShowComponent;
  let fixture: ComponentFixture<ListToShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListToShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListToShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
