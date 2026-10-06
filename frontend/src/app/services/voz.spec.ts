import { TestBed } from '@angular/core/testing';

import { Voz } from './voz';

describe('Voz', () => {
  let service: Voz;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Voz);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
