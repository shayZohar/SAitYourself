/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpUploadService } from './http-upload.service';

describe('Service: HttpUpload', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpUploadService]
    });
  });

  it('should ...', inject([HttpUploadService], (service: HttpUploadService) => {
    expect(service).toBeTruthy();
  }));
});
