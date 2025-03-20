import { Component, inject, output, signal, effect } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';

const MATERIAL_MODULE = [MatToolbarModule, MatIconModule, MatButtonModule];

@Component({
  selector: 'app-toolbar',
  imports: [MATERIAL_MODULE, RouterModule],
  template: `
    <mat-toolbar color="primary">
      <a mat-button routerLink="/">
        <mat-icon>home</mat-icon>
        <span>Home</span>
      </a>
      <a mat-button routerLink="/projects">
        <mat-icon>list_alt</mat-icon>
        <span>Projects</span>
      </a>
      <span class="spacer"></span>
      @if (!isDetailPage()) {
      <a mat-button (click)="emitClick()">
        <mat-icon>add_box</mat-icon>
        <span>Nuevo proyecto</span>
      </a>
      }
    </mat-toolbar>
  `,
  styles: ``,
})
export class ToolbarComponent {
  private readonly _router = inject(Router);
  onNewProjectEvent = output<void>();
  currentUrl = signal(this._router.url);

  constructor() {
    effect(() => {
      this._router.events.subscribe(() => {
        this.currentUrl.set(this._router.url);
      });
    });
  }

  emitClick(): void {
    this.onNewProjectEvent.emit();
  }

  isDetailPage(): boolean {
    return this.currentUrl().includes('/project-detail');
  }
}
