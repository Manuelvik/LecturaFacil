import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionAccesibilidad } from './configuracion-accesibilidad';

describe('ConfiguracionAccesibilidad', () => {
  let component: ConfiguracionAccesibilidad;
  let fixture: ComponentFixture<ConfiguracionAccesibilidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionAccesibilidad],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracionAccesibilidad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
