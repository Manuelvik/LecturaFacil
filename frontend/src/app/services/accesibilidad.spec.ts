import { TestBed } from '@angular/core/testing';

import { Accesibilidad } from './accesibilidad';

describe('Accesibilidad', () => {
  let service: Accesibilidad;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Accesibilidad);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
