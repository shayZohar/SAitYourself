/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SignUpService } from './http-sign-up.service';

describe('Service: SignUp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignUpService]
    });
  });

  it('should ...', inject([SignUpService], (service: SignUpService) => {
    expect(service).toBeTruthy();
  }));
});
