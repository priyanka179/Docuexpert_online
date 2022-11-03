import { TestBed } from '@angular/core/testing';

import { UploadDirectoryService } from './upload-directory.service';

describe('UploadDirectoryService', () => {
  let service: UploadDirectoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadDirectoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
