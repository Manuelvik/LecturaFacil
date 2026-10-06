import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lectura } from './lectura';

describe('Lectura', () => {
  let component: Lectura;
  let fixture: ComponentFixture<Lectura>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lectura],
    }).compileComponents();

    fixture = TestBed.createComponent(Lectura);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
