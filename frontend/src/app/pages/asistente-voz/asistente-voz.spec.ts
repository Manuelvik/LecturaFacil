import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenteVoz } from './asistente-voz';

describe('AsistenteVoz', () => {
  let component: AsistenteVoz;
  let fixture: ComponentFixture<AsistenteVoz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenteVoz],
    }).compileComponents();

    fixture = TestBed.createComponent(AsistenteVoz);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
