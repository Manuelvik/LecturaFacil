import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Accesibilidad } from '../../services/accesibilidad';

@Component({
  selector: 'app-configuracion-accesibilidad',
  imports: [RouterLink],
  templateUrl: './configuracion-accesibilidad.html',
  styleUrl: './configuracion-accesibilidad.css'
})
export class ConfiguracionAccesibilidad {

  accesibilidad = inject(Accesibilidad);

  cambiarTamano(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.accesibilidad.cambiarTamano(
      Number(input.value)
    );
  }

  cambiarContraste(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.accesibilidad.cambiarContraste(
      input.checked
    );
  }

  cambiarSubtitulos(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.accesibilidad.cambiarSubtitulos(
      input.checked
    );
  }

  cambiarNavegacionVoz(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.accesibilidad.cambiarNavegacionVoz(
      input.checked
    );
  }

  cambiarModoSimplificado(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.accesibilidad.cambiarModoSimplificado(
      input.checked
    );
  }

  cambiarVelocidad(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.accesibilidad.cambiarVelocidad(
      Number(input.value)
    );
  }

  restaurar(): void {
    this.accesibilidad.restaurar();
  }
}
