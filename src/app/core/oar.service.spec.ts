import { TestBed, inject } from '@angular/core/testing';

import { OarService } from './oar.service';

describe('OarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OarService]
    });
  });

  it('should be created', inject([OarService], (service: OarService) => {
    expect(service).toBeTruthy();
  }));
});
