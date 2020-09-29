import { TestBed } from '@angular/core/testing';

import { BusinessResolverService } from './business-resolver.service';

describe('BusinessResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusinessResolverService = TestBed.get(BusinessResolverService);
    expect(service).toBeTruthy();
  });
});
