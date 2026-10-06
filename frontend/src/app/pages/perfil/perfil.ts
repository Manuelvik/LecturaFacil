import {
  Component,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Accesibilidad } from '../../services/accesibilidad';


@Component({
  selector: 'app-perfil',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {

  accesibilidad = inject(Accesibilidad);


  // =====================================
  // DATOS DEL PERFIL
  // =====================================

  nombre: string = '';

  correo: string = '';

  mensaje: string = '';


  constructor() {

    this.cargarPerfil();

  }


  // =====================================
  // INICIALES
  // =====================================

  iniciales(): string {

    if (!this.nombre.trim()) {
      return 'U';
    }


    const partes =
      this.nombre
        .trim()
        .split(' ')
        .filter(parte => parte.length > 0);


    if (partes.length === 1) {

      return partes[0]
        .charAt(0)
        .toUpperCase();

    }


    return (
      partes[0].charAt(0) +
      partes[1].charAt(0)
    ).toUpperCase();

  }


  // =====================================
  // GUARDAR PERFIL
  // =====================================

  guardarPerfil(): void {

    if (!this.nombre.trim()) {

      this.mensaje =
        'Ingresa tu nombre.';

      return;

    }


    const perfil = {

      nombre:
        this.nombre.trim(),

      correo:
        this.correo.trim()

    };


    localStorage.setItem(
      'perfilLecturaFacil',
      JSON.stringify(perfil)
    );


    this.nombre =
      perfil.nombre;


    this.correo =
      perfil.correo;


    this.mensaje =
      'Perfil guardado correctamente.';

  }


  // =====================================
  // CARGAR PERFIL
  // =====================================

  private cargarPerfil(): void {

    try {

      const datos =
        localStorage.getItem(
          'perfilLecturaFacil'
        );


      if (!datos) {
        return;
      }


      const perfil =
        JSON.parse(datos);


      this.nombre =
        perfil.nombre ?? '';


      this.correo =
        perfil.correo ?? '';


    } catch (error) {

      console.error(
        'Error al cargar perfil:',
        error
      );


      localStorage.removeItem(
        'perfilLecturaFacil'
      );

    }

  }

}
