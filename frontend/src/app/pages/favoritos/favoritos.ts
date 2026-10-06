import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  inject
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Documentos,
  DocumentoGuardado
} from '../../services/documentos';

import { Accesibilidad } from '../../services/accesibilidad';


@Component({
  selector: 'app-favoritos',
  imports: [
    DatePipe,
    RouterLink
  ],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css'
})
export class Favoritos implements OnDestroy {

  documentos = inject(Documentos);

  accesibilidad = inject(Accesibilidad);

  private cdr = inject(ChangeDetectorRef);


  documentoAbiertoId: number | null = null;

  documentoLeyendoId: number | null = null;


  // =====================================
  // OBTENER FAVORITOS
  // =====================================

  favoritos(): DocumentoGuardado[] {

    return this.documentos
      .obtenerFavoritos();

  }


  // =====================================
  // VER / OCULTAR CONTENIDO
  // =====================================

  cambiarVista(
    id: number
  ): void {

    if (
      this.documentoAbiertoId === id
    ) {

      this.documentoAbiertoId = null;

    } else {

      this.documentoAbiertoId = id;

    }

  }


  // =====================================
  // QUITAR DE FAVORITOS
  // =====================================

  quitarFavorito(
    id: number
  ): void {

    if (
      this.documentoLeyendoId === id
    ) {

      this.detenerLectura();

    }


    if (
      this.documentoAbiertoId === id
    ) {

      this.documentoAbiertoId = null;

    }


    this.documentos
      .cambiarFavorito(id);

  }


  // =====================================
  // ESCUCHAR DOCUMENTO
  // =====================================

  escuchar(
    documento: DocumentoGuardado
  ): void {

    // Si ya está leyendo este documento,
    // el mismo botón lo detiene.

    if (
      this.documentoLeyendoId ===
      documento.id
    ) {

      this.detenerLectura();

      return;

    }


    window.speechSynthesis.cancel();


    const mensaje =
      new SpeechSynthesisUtterance(
        documento.contenido
      );


    mensaje.lang = 'es-PE';


    mensaje.rate =
      this.accesibilidad
        .velocidadVoz();


    mensaje.pitch = 1;


    mensaje.onstart = () => {

      this.documentoLeyendoId =
        documento.id;

      this.cdr.detectChanges();

    };


    mensaje.onend = () => {

      this.documentoLeyendoId = null;

      this.cdr.detectChanges();

    };


    mensaje.onerror = () => {

      this.documentoLeyendoId = null;

      this.cdr.detectChanges();

    };


    window.speechSynthesis
      .speak(mensaje);

  }


  // =====================================
  // DETENER LECTURA
  // =====================================

  detenerLectura(): void {

    window.speechSynthesis.cancel();

    this.documentoLeyendoId = null;

    this.cdr.detectChanges();

  }

  ngOnDestroy(): void {

    window.speechSynthesis.cancel();

  }

}
