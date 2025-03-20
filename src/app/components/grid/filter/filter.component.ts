import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

const MATERIAL_MODULE = [MatFormField, MatLabel, MatInput];
@Component({
  selector: 'app-filter',
  imports: [FormsModule, MATERIAL_MODULE],
  template: `
    <mat-form-field>
      <mat-label>{{ label() }}</mat-label>
      <input
        matInput
        type="text"
        [(ngModel)]="filter"
        [placeholder]="placeholder()"
      />
    </mat-form-field>
  `,
  styles: ``,
})
export class FilterComponent {
  filter = model('');
  label = input<string>('Filtro');
  placeholder = input<string>('Escribe aqui para filtrar...');
}
