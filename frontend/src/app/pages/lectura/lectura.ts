import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { createWorker } from 'tesseract.js';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

import { Accesibilidad } from '../../services/accesibilidad';
import { Documentos } from '../../services/documentos';


// Worker utilizado por PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  '/pdf.worker.min.mjs';


@Component({
  selector: 'app-lectura',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './lectura.html',
  styleUrl: './lectura.css'
})
export class Lectura implements OnDestroy {
  accesibilidad = inject(Accesibilidad);

  documentos = inject(Documentos);

  private cdr = inject(ChangeDetectorRef);

  // =====================================
  // TEXTO
  // =====================================

  texto: string = '';

  mensajeGuardado: string = '';

  tamanoTexto: number = 20;

  altoContraste: boolean = false;

  leyendo: boolean = false;

  pausado: boolean = false;

  private mensajeVoz: SpeechSynthesisUtterance | null = null;


  // =====================================
  // OCR / DOCUMENTOS
  // =====================================

  imagenVistaPrevia: string | null = null;

  procesandoOCR: boolean = false;

  mensajeOCR: string = '';

  errorOCR: string = '';


  // =====================================
  // ESCANEAR IMAGEN
  // =====================================

  async seleccionarImagen(
    event: Event
  ): Promise<void> {

    const input =
      event.target as HTMLInputElement;

    const archivo =
      input.files?.[0];


    if (!archivo || this.procesandoOCR) {
      return;
    }


    this.errorOCR = '';
    this.mensajeOCR = '';


    if (!archivo.type.startsWith('image/')) {

      this.errorOCR =
        'Selecciona una imagen válida.';

      this.cdr.detectChanges();

      return;

    }


    if (archivo.size > 10 * 1024 * 1024) {

      this.errorOCR =
        'La imagen no debe superar los 10 MB.';

      this.cdr.detectChanges();

      return;

    }


    this.detenerLectura();


    // Eliminar vista previa anterior

    if (this.imagenVistaPrevia) {

      URL.revokeObjectURL(
        this.imagenVistaPrevia
      );

    }


    // Mostrar imagen seleccionada

    this.imagenVistaPrevia =
      URL.createObjectURL(archivo);


    this.procesandoOCR = true;

    this.mensajeOCR =
      'Reconociendo el texto de la imagen...';


    this.cdr.detectChanges();


    let worker:
      Awaited<ReturnType<typeof createWorker>> | null = null;


    try {

      // OCR en español

      worker =
        await createWorker('spa');


      const resultado =
        await worker.recognize(archivo);


      const textoExtraido =
        resultado.data.text.trim();


      if (textoExtraido) {

        this.texto =
          textoExtraido;


        this.mensajeOCR =
          'Texto extraído correctamente. Ya puedes escucharlo.';


        this.errorOCR = '';

      } else {

        this.mensajeOCR = '';


        this.errorOCR =
          'No se encontró texto. Intenta utilizar una imagen más clara.';

      }


      this.cdr.detectChanges();


    } catch (error) {

      console.error(
        'Error al procesar OCR:',
        error
      );


      this.mensajeOCR = '';


      this.errorOCR =
        'No se pudo procesar la imagen. Inténtalo nuevamente.';


      this.cdr.detectChanges();


    } finally {

      if (worker) {

        await worker.terminate();

      }


      this.procesandoOCR = false;


      this.cdr.detectChanges();


      input.value = '';

    }

  }


  // =====================================
  // CARGAR DOCUMENTO
  // =====================================

  async seleccionarDocumento(
    event: Event
  ): Promise<void> {

    const input =
      event.target as HTMLInputElement;


    const archivo =
      input.files?.[0];


    if (!archivo) {
      return;
    }


    this.detenerLectura();


    this.errorOCR = '';

    this.mensajeOCR =
      'Cargando documento...';


    this.procesandoOCR = true;


    // Si antes había una imagen,
    // eliminamos su vista previa.

    if (this.imagenVistaPrevia) {

      URL.revokeObjectURL(
        this.imagenVistaPrevia
      );


      this.imagenVistaPrevia = null;

    }


    this.cdr.detectChanges();


    try {

      const nombre =
        archivo.name.toLowerCase();


      // =================================
      // ARCHIVO TXT
      // =================================

      if (nombre.endsWith('.txt')) {

        await this.leerTXT(archivo);

      }


        // =================================
        // ARCHIVO WORD
      // =================================

      else if (nombre.endsWith('.docx')) {

        await this.leerWord(archivo);

      }


        // =================================
        // ARCHIVO PDF
      // =================================

      else if (nombre.endsWith('.pdf')) {

        await this.leerPDF(archivo);

      }


        // =================================
        // FORMATO NO PERMITIDO
      // =================================

      else {

        throw new Error(
          'Formato de archivo no compatible.'
        );

      }


      // Comprobar si encontramos texto

      if (!this.texto.trim()) {

        this.mensajeOCR = '';


        this.errorOCR =
          'No se encontró texto dentro del documento.';

      } else {

        this.errorOCR = '';


        this.mensajeOCR =
          'Documento cargado correctamente. Ya puedes escucharlo.';

      }


    } catch (error) {

      console.error(
        'Error al cargar documento:',
        error
      );


      this.mensajeOCR = '';


      this.errorOCR =
        'No se pudo leer el documento. Comprueba que sea un archivo TXT, PDF o Word válido.';

    } finally {

      this.procesandoOCR = false;


      input.value = '';


      this.cdr.detectChanges();

    }

  }


  // =====================================
  // LEER TXT
  // =====================================

  private async leerTXT(
    archivo: File
  ): Promise<void> {

    const contenido =
      await archivo.text();


    this.texto =
      contenido.trim();

  }


  // =====================================
  // LEER WORD (.DOCX)
  // =====================================

  private async leerWord(
    archivo: File
  ): Promise<void> {

    const arrayBuffer =
      await archivo.arrayBuffer();


    const resultado =
      await mammoth.extractRawText({
        arrayBuffer: arrayBuffer
      });


    this.texto =
      resultado.value.trim();

  }


  // =====================================
  // LEER PDF
  // =====================================

  private async leerPDF(
    archivo: File
  ): Promise<void> {

    const arrayBuffer =
      await archivo.arrayBuffer();


    const datos =
      new Uint8Array(arrayBuffer);


    const documento =
      await pdfjsLib
        .getDocument({
          data: datos
        })
        .promise;


    let textoCompleto = '';


    // Recorremos todas las páginas

    for (
      let numeroPagina = 1;
      numeroPagina <= documento.numPages;
      numeroPagina++
    ) {

      this.mensajeOCR =
        `Leyendo página ${numeroPagina} de ${documento.numPages}...`;


      this.cdr.detectChanges();


      const pagina =
        await documento.getPage(
          numeroPagina
        );


      const contenido =
        await pagina.getTextContent();


      const textoPagina =
        contenido.items
          .map((item: any) => {

            return item.str || '';

          })
          .join(' ');


      textoCompleto +=
        textoPagina + '\n\n';

    }


    this.texto =
      textoCompleto.trim();

  }


  // =====================================
  // TAMAÑO DEL TEXTO
  // =====================================

  aumentarTexto(): void {

    if (this.tamanoTexto < 40) {

      this.tamanoTexto += 2;

    }

  }


  disminuirTexto(): void {

    if (this.tamanoTexto > 14) {

      this.tamanoTexto -= 2;

    }

  }


  // =====================================
  // CONTRASTE
  // =====================================

  cambiarContraste(): void {

    this.altoContraste =
      !this.altoContraste;

  }


  // =====================================
  // LECTURA POR VOZ
  // =====================================

  escucharTexto(): void {

    if (!this.texto.trim()) {

      alert(
        'Primero escribe, pega, escanea o carga un documento.'
      );

      return;
    }


    // Cancelar cualquier lectura anterior
    window.speechSynthesis.cancel();


    this.leyendo = true;
    this.pausado = false;


    // Guardamos la lectura actual
    this.mensajeVoz =
      new SpeechSynthesisUtterance(
        this.texto
      );


    this.mensajeVoz.lang = 'es-PE';


    this.mensajeVoz.rate =
      this.accesibilidad
        .velocidadVoz();


    this.mensajeVoz.pitch = 1;


    this.mensajeVoz.onstart = () => {

      this.leyendo = true;
      this.pausado = false;

      this.cdr.detectChanges();

    };


    this.mensajeVoz.onend = () => {

      this.leyendo = false;
      this.pausado = false;

      this.mensajeVoz = null;

      this.cdr.detectChanges();

    };


    this.mensajeVoz.onerror = () => {

      this.leyendo = false;
      this.pausado = false;

      this.mensajeVoz = null;

      this.cdr.detectChanges();

    };


    window.speechSynthesis.speak(
      this.mensajeVoz
    );

  }


  // =====================================
  // PAUSAR / CONTINUAR
  // =====================================

  pausarContinuar(): void {

    if (!this.leyendo) {
      return;
    }


    if (this.pausado) {

      window.speechSynthesis.resume();

      this.pausado = false;

    } else {

      window.speechSynthesis.pause();

      this.pausado = true;

    }


    this.cdr.detectChanges();

  }


  // =====================================
  // DETENER
  // =====================================

  detenerLectura(): void {

    window.speechSynthesis.cancel();

    this.leyendo = false;
    this.pausado = false;

    this.mensajeVoz = null;

    this.cdr.detectChanges();

  }


  // =====================================
  // LIMPIAR
  // =====================================

  limpiarTexto(): void {

    this.detenerLectura();


    this.texto = '';

    this.mensajeOCR = '';

    this.errorOCR = '';


    if (this.imagenVistaPrevia) {

      URL.revokeObjectURL(
        this.imagenVistaPrevia
      );


      this.imagenVistaPrevia = null;

    }

  }


  guardarEnArchivos(): void {

    if (!this.texto.trim()) {

      this.mensajeGuardado =
        'No hay contenido para guardar.';

      return;

    }


    const guardado =
      this.documentos.guardar(
        this.texto
      );


    if (guardado) {

      this.mensajeGuardado =
        'Documento guardado en Archivos.';

    }

  }


  // =====================================
  // DESTRUIR COMPONENTE
  // =====================================

  ngOnDestroy(): void {

    window.speechSynthesis.cancel();


    if (this.imagenVistaPrevia) {

      URL.revokeObjectURL(
        this.imagenVistaPrevia
      );

    }

  }

}
