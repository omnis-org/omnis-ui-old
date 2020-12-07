import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NetworksService } from './networks.service';

describe('NetworksService', () => {
  let service: NetworksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(NetworksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
