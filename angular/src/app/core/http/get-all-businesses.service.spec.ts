/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GetBusinessService } from './http-businesses.service';

describe('Service: GetAllBusinesses', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetBusinessService]
    });
  });

  it('should ...', inject([GetBusinessService], (service: GetBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
