import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Project } from '../features/projects/project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly STORAGE_KEY = 'projectsData';
  private readonly JSON_URL = '/data.json';
  private readonly _http = inject(HttpClient);

  projects = signal<Project[]>([]);

  fetchProjectsFromJson(): Observable<Project[]> {
    return this._http
      .get<Project[]>(this.JSON_URL)
      .pipe(tap((data: Project[]) => this.saveProjects(data)));
  }

  saveProjects(projects: Project[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    this.projects.set([...projects]);
  }

  getProjects(): Project[] {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  }

  addProject(newProject: Project): void {
    newProject.id = this.generateUniqueId();
    this.projects.update((currentProjects) => {
      const updatedProjects = [newProject, ...currentProjects];
      this.saveProjects(updatedProjects);
      return updatedProjects;
    });
  }

  updateProject(updatedProject: Project): void {
    this.projects.update((currentProjects) => {
      const updatedProjects = currentProjects.map((p) =>
        p.id === updatedProject.id ? updatedProject : p
      );
      this.saveProjects(updatedProjects);
      return updatedProjects;
    });
  }

  deleteProject(projectId: number): void {
    this.projects.update((currentProjects) => {
      const updatedProjects = currentProjects.filter((p) => p.id !== projectId);
      this.saveProjects(updatedProjects);
      return updatedProjects;
    });
  }

  getProjectById(id: number): Project {
    const project = this.projects().find((p) => p.id === id);
    if (!project) throw new Error(`No se encontró el proyecto con ID: ${id}`);
    return project;
  }

  private generateUniqueId(): number {
    return Date.now();
  }
}
