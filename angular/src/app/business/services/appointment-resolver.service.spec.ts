import { TestBed } from '@angular/core/testing';

import { AppointmentResolverService } from './appointment-resolver.service';

describe('AppointmentResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppointmentResolverService = TestBed.get(AppointmentResolverService);
    expect(service).toBeTruthy();
  });
});
