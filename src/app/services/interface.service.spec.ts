import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { InterfaceService } from './interface.service';

describe('InterfaceService', () => {
  let service: InterfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(InterfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
