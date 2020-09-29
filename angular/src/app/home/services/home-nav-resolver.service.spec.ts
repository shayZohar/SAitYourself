import { TestBed } from '@angular/core/testing';

import { HomeNavResolverService } from './home-nav-resolver.service';

describe('HomeNavResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HomeNavResolverService = TestBed.get(HomeNavResolverService);
    expect(service).toBeTruthy();
  });
});
