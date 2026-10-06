import {
  Injectable,
  NgZone,
  signal
} from '@angular/core';

import { Router } from '@angular/router';

import { Accesibilidad } from './accesibilidad';


@Injectable({
  providedIn: 'root'
})
export class Voz {

  escuchando = signal<boolean>(false);

  disponible = signal<boolean>(false);

  textoReconocido = signal<string>('');

  respuesta = signal<string>(
    'Presiona el micrófono para utilizar un comando de voz.'
  );


  private reconocimiento: any;


  constructor(
    private router: Router,
    private accesibilidad: Accesibilidad,
    private ngZone: NgZone
  ) {

    this.configurarReconocimiento();

  }


  // =========================================
  // CONFIGURAR RECONOCIMIENTO
  // =========================================

  private configurarReconocimiento(): void {

    const navegador: any = window;


    const SpeechRecognition =
      navegador.SpeechRecognition ||
      navegador.webkitSpeechRecognition;


    // Navegador no compatible
    if (!SpeechRecognition) {

      this.disponible.set(false);

      this.respuesta.set(
        'El reconocimiento de voz no está disponible en este navegador.'
      );

      return;

    }


    this.disponible.set(true);


    this.reconocimiento =
      new SpeechRecognition();


    // Español de Perú
    this.reconocimiento.lang =
      'es-PE';


    // Solo escuchamos un comando
    this.reconocimiento.continuous =
      false;


    // No mostrar resultados parciales
    this.reconocimiento.interimResults =
      false;


    this.reconocimiento.maxAlternatives =
      1;


    // =====================================
    // EMPIEZA A ESCUCHAR
    // =====================================

    this.reconocimiento.onstart = () => {

      this.ngZone.run(() => {

        this.escuchando.set(true);

        this.respuesta.set(
          'Te estoy escuchando...'
        );

      });

    };


    // =====================================
    // RESULTADO
    // =====================================

    this.reconocimiento.onresult =
      (event: any) => {

        this.ngZone.run(() => {

          const texto =
            event.results[0][0].transcript;


          this.textoReconocido.set(
            texto
          );


          this.procesarComando(
            texto
          );

        });

      };


    // =====================================
    // ERROR
    // =====================================

    this.reconocimiento.onerror =
      (event: any) => {

        this.ngZone.run(() => {

          this.escuchando.set(false);


          if (
            event.error === 'not-allowed'
          ) {

            this.respuesta.set(
              'Necesito permiso para utilizar el micrófono.'
            );

          }

          else if (
            event.error === 'no-speech'
          ) {

            this.respuesta.set(
              'No escuché ningún comando. Inténtalo nuevamente.'
            );

          }

          else if (
            event.error === 'audio-capture'
          ) {

            this.respuesta.set(
              'No se pudo acceder al micrófono.'
            );

          }

          else {

            this.respuesta.set(
              'No pude reconocer tu voz. Inténtalo nuevamente.'
            );

          }

        });

      };


    // =====================================
    // FINALIZA
    // =====================================

    this.reconocimiento.onend = () => {

      this.ngZone.run(() => {

        this.escuchando.set(false);

      });

    };

  }


  // =========================================
  // INICIAR ESCUCHA
  // =========================================

  iniciarEscucha(): void {

    if (!this.reconocimiento) {

      this.respuesta.set(
        'El reconocimiento de voz no está disponible.'
      );

      return;

    }


    if (this.escuchando()) {
      return;
    }


    try {

      /*
       * Evita que LecturaFácil esté hablando
       * mientras intenta escuchar al usuario.
       */
      window.speechSynthesis.cancel();


      this.textoReconocido.set('');


      this.reconocimiento.start();

    }

    catch (error) {

      console.log(
        'El reconocimiento de voz ya está activo.',
        error
      );

    }

  }


  // =========================================
  // DETENER ESCUCHA
  // =========================================

  detenerEscucha(): void {

    if (!this.reconocimiento) {
      return;
    }


    try {

      this.reconocimiento.stop();

    }

    catch (error) {

      console.log(
        'No había reconocimiento activo.',
        error
      );

    }


    this.escuchando.set(false);

  }


  // =========================================
  // NORMALIZAR TEXTO
  // =========================================

  private normalizarTexto(
    texto: string
  ): string {

    return texto
      .toLowerCase()

      /*
       * Convierte:
       * configuración -> configuracion
       * información   -> informacion
       * página        -> pagina
       */
      .normalize('NFD')

      .replace(
        /[\u0300-\u036f]/g,
        ''
      )

      .trim();

  }


  // =========================================
  // PROCESAR COMANDO
  // =========================================

  procesarComando(
    texto: string
  ): void {

    const comando =
      this.normalizarTexto(
        texto
      );


    // =====================================
    // ACCESIBILIDAD
    // =====================================


    // -------------------------------------
    // ALTO CONTRASTE - DESACTIVAR
    // -------------------------------------

    if (
      comando.includes(
        'desactivar alto contraste'
      ) ||
      comando.includes(
        'desactiva alto contraste'
      ) ||
      comando.includes(
        'quitar alto contraste'
      )
    ) {

      this.accesibilidad
        .cambiarContraste(false);


      this.responder(
        'Alto contraste desactivado.'
      );

      return;

    }


    // -------------------------------------
    // ALTO CONTRASTE - ACTIVAR
    // -------------------------------------

    if (
      comando.includes(
        'activar alto contraste'
      ) ||
      comando.includes(
        'activa alto contraste'
      ) ||
      comando.includes(
        'poner alto contraste'
      )
    ) {

      this.accesibilidad
        .cambiarContraste(true);


      this.responder(
        'Alto contraste activado.'
      );

      return;

    }


    // -------------------------------------
    // AUMENTAR TEXTO
    // -------------------------------------

    if (
      comando.includes(
        'aumentar texto'
      ) ||
      comando.includes(
        'aumenta el texto'
      ) ||
      comando.includes(
        'texto mas grande'
      ) ||
      comando.includes(
        'agrandar texto'
      )
    ) {

      const nuevoTamano =
        Math.min(
          125,
          this.accesibilidad.tamano() + 5
        );


      this.accesibilidad
        .cambiarTamano(
          nuevoTamano
        );


      this.responder(
        `Tamaño aumentado a ${nuevoTamano} por ciento.`
      );

      return;

    }


    // -------------------------------------
    // DISMINUIR TEXTO
    // -------------------------------------

    if (
      comando.includes(
        'disminuir texto'
      ) ||
      comando.includes(
        'disminuye el texto'
      ) ||
      comando.includes(
        'texto mas pequeno'
      ) ||
      comando.includes(
        'reducir texto'
      )
    ) {

      const nuevoTamano =
        Math.max(
          90,
          this.accesibilidad.tamano() - 5
        );


      this.accesibilidad
        .cambiarTamano(
          nuevoTamano
        );


      this.responder(
        `Tamaño reducido a ${nuevoTamano} por ciento.`
      );

      return;

    }


    // -------------------------------------
    // MODO SIMPLE - DESACTIVAR
    // -------------------------------------

    if (
      comando.includes(
        'desactivar modo simple'
      ) ||
      comando.includes(
        'desactivar modo simplificado'
      ) ||
      comando.includes(
        'desactiva modo simple'
      ) ||
      comando.includes(
        'quitar modo simple'
      )
    ) {

      this.accesibilidad
        .cambiarModoSimplificado(
          false
        );


      this.responder(
        'Modo simplificado desactivado.'
      );

      return;

    }


    // -------------------------------------
    // MODO SIMPLE - ACTIVAR
    // -------------------------------------

    if (
      comando.includes(
        'activar modo simple'
      ) ||
      comando.includes(
        'activar modo simplificado'
      ) ||
      comando.includes(
        'activa modo simple'
      ) ||
      comando.includes(
        'poner modo simple'
      )
    ) {

      this.accesibilidad
        .cambiarModoSimplificado(
          true
        );


      this.responder(
        'Modo simplificado activado.'
      );

      return;

    }


    // -------------------------------------
    // SUBTÍTULOS - DESACTIVAR
    // -------------------------------------

    if (
      comando.includes(
        'desactivar subtitulos'
      ) ||
      comando.includes(
        'desactiva subtitulos'
      ) ||
      comando.includes(
        'quitar subtitulos'
      )
    ) {

      this.accesibilidad
        .cambiarSubtitulos(
          false
        );


      this.responder(
        'Subtítulos desactivados.'
      );

      return;

    }


    // -------------------------------------
    // SUBTÍTULOS - ACTIVAR
    // -------------------------------------

    if (
      comando.includes(
        'activar subtitulos'
      ) ||
      comando.includes(
        'activa subtitulos'
      ) ||
      comando.includes(
        'poner subtitulos'
      )
    ) {

      this.accesibilidad
        .cambiarSubtitulos(
          true
        );


      this.responder(
        'Subtítulos activados.'
      );

      return;

    }


    // =====================================
    // NAVEGACIÓN
    // =====================================


    // -------------------------------------
    // INICIO
    // -------------------------------------

    if (
      comando.includes(
        'abrir inicio'
      ) ||
      comando === 'inicio' ||
      comando.includes(
        'pagina principal'
      ) ||
      comando.includes(
        'ir al inicio'
      )
    ) {

      this.responder(
        'Abriendo inicio.'
      );


      this.navegar(
        '/inicio'
      );

      return;

    }


    // -------------------------------------
    // FAVORITOS
    // -------------------------------------

    if (
      comando.includes(
        'favoritos'
      )
    ) {

      this.responder(
        'Abriendo favoritos.'
      );


      this.navegar(
        '/favoritos'
      );

      return;

    }


    // -------------------------------------
    // ARCHIVOS
    // -------------------------------------

    if (
      comando.includes(
        'archivo'
      ) ||
      comando.includes(
        'mis documentos'
      )
    ) {

      this.responder(
        'Abriendo archivos.'
      );


      this.navegar(
        '/archivos'
      );

      return;

    }


    // -------------------------------------
    // PERFIL
    // -------------------------------------

    if (
      comando.includes(
        'perfil'
      )
    ) {

      this.responder(
        'Abriendo perfil.'
      );


      this.navegar(
        '/perfil'
      );

      return;

    }


    // -------------------------------------
    // LECTURA
    // -------------------------------------

    if (
      comando.includes(
        'leer informacion'
      ) ||
      comando.includes(
        'abrir lectura'
      ) ||
      comando.includes(
        'pantalla de lectura'
      ) ||
      comando.includes(
        'ir a lectura'
      )
    ) {

      this.responder(
        'Abriendo lectura de información.'
      );


      this.navegar(
        '/lectura'
      );

      return;

    }


    // -------------------------------------
    // CONFIGURACIÓN DE ACCESIBILIDAD
    // -------------------------------------

    if (
      comando.includes(
        'abrir configuracion'
      ) ||
      comando.includes(
        'configuracion de accesibilidad'
      ) ||
      comando.includes(
        'abrir ajustes'
      ) ||
      comando.includes(
        'ajustes de accesibilidad'
      )
    ) {

      this.responder(
        'Abriendo configuración de accesibilidad.'
      );


      this.navegar(
        '/configuracion-accesibilidad'
      );

      return;

    }


    // =====================================
    // COMANDO NO RECONOCIDO
    // =====================================

    this.responder(
      'No reconocí ese comando. Puedes decir abrir inicio, abrir archivos, abrir favoritos, aumentar texto o activar alto contraste.'
    );

  }


  // =========================================
  // NAVEGAR
  // =========================================

  private navegar(
    ruta: string
  ): void {

    /*
     * Esperamos un momento para que el usuario
     * escuche la confirmación antes de cambiar
     * de pantalla.
     */
    setTimeout(() => {

      this.router.navigate([
        ruta
      ]);

    }, 800);

  }


  // =========================================
  // RESPUESTA HABLADA
  // =========================================

  responder(
    mensaje: string
  ): void {

    this.respuesta.set(
      mensaje
    );


    window.speechSynthesis.cancel();


    const voz =
      new SpeechSynthesisUtterance(
        mensaje
      );


    voz.lang =
      'es-PE';


    voz.rate =
      this.accesibilidad
        .velocidadVoz();


    voz.pitch = 1;


    window.speechSynthesis.speak(
      voz
    );

  }

}
