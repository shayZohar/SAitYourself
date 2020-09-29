import { TestBed, async, inject } from '@angular/core/testing';

import { BusinessGuard } from './business.guard';

describe('BusinessGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessGuard]
    });
  });

  it('should ...', inject([BusinessGuard], (guard: BusinessGuard) => {
    expect(guard).toBeTruthy();
  }));
});
