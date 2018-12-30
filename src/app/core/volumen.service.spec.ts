import { TestBed, inject } from '@angular/core/testing';

import { VolumenService } from './volumen.service';

describe('VolumenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VolumenService]
    });
  });

  it('should be created', inject([VolumenService], (service: VolumenService) => {
    expect(service).toBeTruthy();
  }));
});
