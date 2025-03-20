import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatCardModule } from '@angular/material/card';
import { ModalService } from './services/modal.service';
import { ModalProjectFormComponent } from './features/projects/modal-form/modal-project-form.component';
import { Project } from './features/projects/project.interface';

const MATERIAL_MODULE = [MatCardModule];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolbarComponent, MATERIAL_MODULE],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly _modalService = inject(ModalService);
  onClickNewProject(): void {
    this._modalService.openModal<ModalProjectFormComponent, Project>(
      ModalProjectFormComponent
    );
  }
}
