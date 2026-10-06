import {
  Component,
  OnDestroy,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import {
  Documentos,
  DocumentoGuardado
} from '../../services/documentos';

import { Accesibilidad } from '../../services/accesibilidad';


@Component({
  selector: 'app-archivos',
  imports: [
    FormsModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './archivos.html',
  styleUrl: './archivos.css'
})
export class Archivos implements OnDestroy {

  documentos = inject(Documentos);

  accesibilidad = inject(Accesibilidad);


  // Texto del buscador
  busqueda: string = '';


  // Documento que se está escuchando
  documentoLeyendoId: number | null = null;


  // Documento cuyo contenido está expandido
  documentoAbiertoId: number | null = null;


  // =====================================
  // BUSCAR DOCUMENTOS
  // =====================================

  documentosFiltrados():
    DocumentoGuardado[] {

    const textoBusqueda =
      this.normalizarTexto(
        this.busqueda
      );


    if (!textoBusqueda) {

      return this.documentos
        .documentos();

    }


    return this.documentos
      .documentos()
      .filter(documento => {

        const titulo =
          this.normalizarTexto(
            documento.titulo
          );


        const contenido =
          this.normalizarTexto(
            documento.contenido
          );


        return (
          titulo.includes(textoBusqueda) ||
          contenido.includes(textoBusqueda)
        );

      });

  }


  // =====================================
  // NORMALIZAR BÚSQUEDA
  // =====================================

  private normalizarTexto(
    texto: string
  ): string {

    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .trim();

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
  // FAVORITOS
  // =====================================

  cambiarFavorito(
    id: number
  ): void {

    this.documentos
      .cambiarFavorito(id);

  }


  // =====================================
  // ESCUCHAR DOCUMENTO
  // =====================================

  escuchar(
    documento: DocumentoGuardado
  ): void {

    // Si ya estaba leyendo este documento,
    // lo detenemos.

    if (
      this.documentoLeyendoId ===
      documento.id
    ) {

      this.detenerLectura();

      return;

    }


    // Detener cualquier lectura anterior

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

    };


    mensaje.onend = () => {

      this.documentoLeyendoId =
        null;

    };


    mensaje.onerror = () => {

      this.documentoLeyendoId =
        null;

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

  }


  // =====================================
  // ELIMINAR DOCUMENTO
  // =====================================

  eliminar(
    documento: DocumentoGuardado
  ): void {

    const confirmar =
      window.confirm(
        `¿Deseas eliminar "${documento.titulo}"?`
      );


    if (!confirmar) {
      return;
    }


    if (
      this.documentoLeyendoId ===
      documento.id
    ) {

      this.detenerLectura();

    }


    this.documentos
      .eliminar(documento.id);


    if (
      this.documentoAbiertoId ===
      documento.id
    ) {

      this.documentoAbiertoId = null;

    }

  }


  // =====================================
  // SALIR DE LA PANTALLA
  // =====================================

  ngOnDestroy(): void {

    window.speechSynthesis.cancel();

  }

}
