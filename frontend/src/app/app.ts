import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './components/navbar/navbar';
import { Voz } from './services/voz';

import { Accesibilidad } from './services/accesibilidad';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  voz = inject(Voz);

  accesibilidad = inject(Accesibilidad);

}
