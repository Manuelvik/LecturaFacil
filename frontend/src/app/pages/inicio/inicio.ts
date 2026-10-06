import {
  Component,
  inject
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { Accesibilidad } from '../../services/accesibilidad';


@Component({
  selector: 'app-inicio',
  imports: [
    RouterLink
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {

  accesibilidad = inject(Accesibilidad);


  // =====================================
  // TEXTO GRANDE
  // =====================================

  cambiarTextoGrande(): void {

    if (this.textoGrandeActivo()) {

      this.accesibilidad
        .cambiarTamano(100);

    } else {

      this.accesibilidad
        .cambiarTamano(120);

    }

  }


  textoGrandeActivo(): boolean {

    return (
      this.accesibilidad.tamano() >= 115
    );

  }


  // =====================================
  // ALTO CONTRASTE
  // =====================================

  cambiarContraste(): void {

    this.accesibilidad
      .cambiarContraste(
        !this.accesibilidad
          .altoContraste()
      );

  }


  // =====================================
  // NAVEGACIÓN POR VOZ
  // =====================================

  cambiarNavegacionVoz(): void {

    const nuevoEstado =
      !this.accesibilidad
        .navegacionVoz();


    this.accesibilidad
      .cambiarNavegacionVoz(
        nuevoEstado
      );

  }


  cambiarModoSimple(): void {

    this.accesibilidad
      .cambiarModoSimplificado(
        !this.accesibilidad
          .modoSimplificado()
      );

  }

}
