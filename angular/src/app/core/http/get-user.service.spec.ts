/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GetUserService } from './http-get-user.service';

describe('Service: GetUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetUserService]
    });
  });

  it('should ...', inject([GetUserService], (service: GetUserService) => {
    expect(service).toBeTruthy();
  }));
});
