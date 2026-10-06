import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { Favoritos } from './pages/favoritos/favoritos';
import { Archivos } from './pages/archivos/archivos';
import { Perfil } from './pages/perfil/perfil';
import { Lectura } from './pages/lectura/lectura';
import { AsistenteVoz } from './pages/asistente-voz/asistente-voz';
import { ConfiguracionAccesibilidad } from './pages/configuracion-accesibilidad/configuracion-accesibilidad';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  { path: 'inicio', component: Inicio },
  { path: 'favoritos', component: Favoritos },
  { path: 'archivos', component: Archivos },
  { path: 'perfil', component: Perfil },

  { path: 'lectura', component: Lectura },
  { path: 'asistente-voz', component: AsistenteVoz },
  {
    path: 'configuracion-accesibilidad',
    component: ConfiguracionAccesibilidad
  },

  { path: '**', redirectTo: 'inicio' }
];
