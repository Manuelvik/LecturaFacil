import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  private http = inject(HttpClient);

  private readonly apiUrl =
    'https://lecturafacil-backend.onrender.com/api/documentos';

  documentos = signal<DocumentoGuardado[]>([]);

  constructor() {
    this.cargarDocumentos();
  }

  private cargarDocumentos(): void {

    this.http
      .get<DocumentoGuardado[]>(this.apiUrl)
      .subscribe({

        next: (documentos) => {
          this.documentos.set(documentos);
        },

        error: (error) => {
          console.error(
            'Error al cargar documentos:',
            error
          );
        }

      });
  }

  guardar(contenido: string): boolean {

    const texto = contenido.trim();

    if (!texto) {
      return false;
    }

    const primeraLinea =
      texto.split('\n')[0].trim();

    const titulo =
      primeraLinea.length > 40
        ? primeraLinea.substring(0, 40) + '...'
        : primeraLinea || 'Documento sin título';

    const nuevoDocumento = {
      titulo: titulo,
      contenido: texto,
      fecha: new Date().toISOString(),
      favorito: false
    };

    this.http
      .post<DocumentoGuardado>(
        this.apiUrl,
        nuevoDocumento
      )
      .subscribe({

        next: (documentoGuardado) => {

          this.documentos.update(
            documentos => [
              ...documentos,
              documentoGuardado
            ]
          );

          console.log(
            'Documento guardado en MySQL:',
            documentoGuardado
          );
        },

        error: (error) => {

          console.error(
            'Error al guardar documento:',
            error
          );

        }

      });

    return true;
  }

  eliminar(id: number): void {

    this.http
      .delete(`${this.apiUrl}/${id}`)
      .subscribe({

        next: () => {

          this.documentos.update(
            documentos =>
              documentos.filter(
                documento =>
                  documento.id !== id
              )
          );

        },

        error: (error) => {

          console.error(
            'Error al eliminar documento:',
            error
          );

        }

      });
  }

  cambiarFavorito(id: number): void {

    const documento =
      this.documentos()
        .find(d => d.id === id);

    if (!documento) {
      return;
    }

    const actualizado: DocumentoGuardado = {
      ...documento,
      favorito: !documento.favorito
    };

    this.http
      .put<DocumentoGuardado>(
        `${this.apiUrl}/${id}`,
        actualizado
      )
      .subscribe({

        next: (documentoActualizado) => {

          this.documentos.update(
            documentos =>
              documentos.map(
                d =>
                  d.id === id
                    ? documentoActualizado
                    : d
              )
          );

        },

        error: (error) => {

          console.error(
            'Error al actualizar favorito:',
            error
          );

        }

      });
  }

  obtenerFavoritos(): DocumentoGuardado[] {

    return this.documentos()
      .filter(
        documento =>
          documento.favorito
      );

  }
}
