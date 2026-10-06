import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Accesibilidad {

  tamano = signal<number>(100);
  altoContraste = signal<boolean>(false);
  modoSimplificado = signal<boolean>(false);
  subtitulos = signal<boolean>(false);
  navegacionVoz = signal<boolean>(false);
  velocidadVoz = signal<number>(1);

  constructor() {
    this.cargarConfiguracion();
  }

  cambiarTamano(valor: number): void {
    this.tamano.set(valor);
    this.aplicarConfiguracion();
  }

  cambiarContraste(valor: boolean): void {
    this.altoContraste.set(valor);
    this.aplicarConfiguracion();
  }

  cambiarModoSimplificado(valor: boolean): void {
    this.modoSimplificado.set(valor);
    this.aplicarConfiguracion();
  }

  cambiarSubtitulos(valor: boolean): void {
    this.subtitulos.set(valor);
    this.guardarConfiguracion();
  }

  cambiarNavegacionVoz(valor: boolean): void {
    this.navegacionVoz.set(valor);
    this.guardarConfiguracion();
  }

  cambiarVelocidad(valor: number): void {
    this.velocidadVoz.set(valor);
    this.guardarConfiguracion();
  }

  restaurar(): void {
    this.tamano.set(100);
    this.altoContraste.set(false);
    this.modoSimplificado.set(false);
    this.subtitulos.set(false);
    this.navegacionVoz.set(false);
    this.velocidadVoz.set(1);

    this.aplicarConfiguracion();
  }

  aplicarConfiguracion(): void {

    document.documentElement.style.setProperty(
      '--zoom-accesibilidad',
      String(this.tamano() / 100)
    );

    document.body.classList.toggle(
      'alto-contraste-global',
      this.altoContraste()
    );

    document.body.classList.toggle(
      'modo-simplificado-global',
      this.modoSimplificado()
    );

    this.guardarConfiguracion();
  }

  private guardarConfiguracion(): void {

    const configuracion = {
      tamano: this.tamano(),
      altoContraste: this.altoContraste(),
      modoSimplificado: this.modoSimplificado(),
      subtitulos: this.subtitulos(),
      navegacionVoz: this.navegacionVoz(),
      velocidadVoz: this.velocidadVoz()
    };

    localStorage.setItem(
      'configuracionAccesibilidad',
      JSON.stringify(configuracion)
    );
  }

  private cargarConfiguracion(): void {

    const guardado =
      localStorage.getItem('configuracionAccesibilidad');

    if (guardado) {

      try {

        const configuracion = JSON.parse(guardado);

        this.tamano.set(configuracion.tamano ?? 100);
        this.altoContraste.set(configuracion.altoContraste ?? false);
        this.modoSimplificado.set(configuracion.modoSimplificado ?? false);
        this.subtitulos.set(configuracion.subtitulos ?? false);
        this.navegacionVoz.set(configuracion.navegacionVoz ?? false);
        this.velocidadVoz.set(configuracion.velocidadVoz ?? 1);

      } catch {
        localStorage.removeItem('configuracionAccesibilidad');
      }
    }

    this.aplicarConfiguracion();
  }
}
