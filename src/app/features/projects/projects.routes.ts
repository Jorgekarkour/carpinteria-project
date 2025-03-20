import { Routes } from '@angular/router';

const projectsRoute: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./project-list/project-list.component').then(
        (m) => m.ProjectListComponent
      ),
  },
  {
    path: 'project-detail/:id',
    loadComponent: () =>
      import('./project-detail/project-detail.component').then(
        (m) => m.ProjectDetailComponent
      ),
  },
];

export default projectsRoute;
