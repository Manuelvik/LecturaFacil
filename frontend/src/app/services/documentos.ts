import { Injectable, signal } from '@angular/core';

export interface DocumentoGuardado {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  favorito: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Documentos {

  documentos = signal<DocumentoGuardado[]>([]);

  constructor() {
    this.cargarDocumentos();
  }


  // =====================================
  // GUARDAR DOCUMENTO
  // =====================================

  guardar(
    contenido: string
  ): boolean {

    const textoLimpio = contenido.trim();

    if (!textoLimpio) {
      return false;
    }


    // Utilizamos la primera línea como título
    const primeraLinea =
      textoLimpio
        .split('\n')[0]
        .trim();


    let titulo =
      primeraLinea.length > 40
        ? primeraLinea.substring(0, 40) + '...'
        : primeraLinea;


    if (!titulo) {
      titulo = 'Lectura guardada';
    }


    const nuevoDocumento: DocumentoGuardado = {

      id: Date.now(),

      titulo: titulo,

      contenido: textoLimpio,

      fecha: new Date().toISOString(),

      favorito: false

    };


    this.documentos.update(
      documentos => [
        nuevoDocumento,
        ...documentos
      ]
    );


    this.guardarLocalStorage();

    return true;

  }


  // =====================================
  // ELIMINAR
  // =====================================

  eliminar(id: number): void {

    this.documentos.update(
      documentos =>
        documentos.filter(
          documento =>
            documento.id !== id
        )
    );


    this.guardarLocalStorage();

  }


  // =====================================
  // FAVORITO
  // =====================================

  cambiarFavorito(id: number): void {

    this.documentos.update(
      documentos =>
        documentos.map(
          documento => {

            if (documento.id === id) {

              return {
                ...documento,
                favorito:
                  !documento.favorito
              };

            }

            return documento;

          }
        )
    );


    this.guardarLocalStorage();

  }


  // =====================================
  // OBTENER FAVORITOS
  // =====================================

  obtenerFavoritos():
    DocumentoGuardado[] {

    return this.documentos()
      .filter(
        documento =>
          documento.favorito
      );

  }


  // =====================================
  // LOCAL STORAGE
  // =====================================

  private guardarLocalStorage(): void {

    localStorage.setItem(
      'documentosLecturaFacil',
      JSON.stringify(
        this.documentos()
      )
    );

  }


  private cargarDocumentos(): void {

    try {

      const datos =
        localStorage.getItem(
          'documentosLecturaFacil'
        );


      if (datos) {

        this.documentos.set(
          JSON.parse(datos)
        );

      }

    } catch (error) {

      console.error(
        'Error al cargar documentos:',
        error
      );


      localStorage.removeItem(
        'documentosLecturaFacil'
      );

    }

  }

}
