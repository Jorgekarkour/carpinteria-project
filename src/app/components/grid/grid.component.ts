import {
  Component,
  computed,
  effect,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FilterComponent } from './filter/filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Module, ModuleType } from '../../features/modules/module.interface';
import { Project } from '../../features/projects/project.interface';

const MATERIAL_MODULE = [
  MatPaginatorModule,
  MatTableModule,
  MatSortModule,
  MatIconModule,
  MatButtonModule,
];
@Component({
  selector: 'app-grid',
  imports: [MATERIAL_MODULE, FilterComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent<T extends object> implements OnInit {
  onViewEvent = output<number | Module | any>();
  onDeleteEvent = output<number | Module | any>();
  displayedColumns = input.required<string[]>();
  data = input.required<T[]>();
  sortableColumns = input<string[]>([]);
  showFilter = input<boolean>(true);
  columnHeaders = input<Record<string, string>>();
  dataSource = new MatTableDataSource<T>();
  valueToFilter = signal('');

  moduleTypeLabels: Record<number, string> = {
    [ModuleType.ESTANTERIA]: 'Estantería',
    [ModuleType.ENCIMERA]: 'Encimera',
  };

  private readonly _sort = viewChild.required<MatSort>(MatSort);
  private readonly _paginator = viewChild.required<MatPaginator>(MatPaginator);

  constructor() {
    effect(() => {
      this.dataSource.data = this.data();
    });
    effect(() => {
      this.dataSource.filter = this.valueToFilter() || '';
    });
  }
  ngOnInit(): void {
    this.dataSource.data = this.data();
    this.dataSource.sort = this._sort();
    this.dataSource.paginator = this._paginator();
  }

  emitViewClick(event: Module | Project) {
    this.onViewEvent.emit(event);
  }

  emitDeleteClick(event: Module | Project) {
    this.onDeleteEvent.emit(event);
  }
}
