import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'projects',
    loadChildren: () =>
      import('./features/projects/projects.routes').then((m) => m.default), // ✅ Corregido
  },
  { path: '**', redirectTo: 'projects' }, // ✅ Redirigir correctamente
];
