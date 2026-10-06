import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Voz } from '../../services/voz';

@Component({
  selector: 'app-asistente-voz',
  imports: [RouterLink],
  templateUrl: './asistente-voz.html',
  styleUrl: './asistente-voz.css'
})
export class AsistenteVoz {

  voz = inject(Voz);

}
