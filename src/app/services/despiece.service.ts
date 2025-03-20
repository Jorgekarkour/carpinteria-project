import { Injectable } from '@angular/core';
import { ModuleType } from '../features/modules/module.interface';

@Injectable({
  providedIn: 'root',
})
export class DespieceService {
  constructor() {}

  getDespiece(
    moduleType: ModuleType,
    width: number,
    hasDoors: boolean,
    doorCount: number,
    shelfCount: number = 2
  ) {
    if (moduleType === ModuleType.ENCIMERA) {
      return this._getDespieceEncimera(width, hasDoors, doorCount);
    } else if (moduleType === ModuleType.ESTANTERIA) {
      return this._getDespieceEstanteria(width, shelfCount);
    }
    return [];
  }

  private _getDespieceEncimera(
    width: number,
    hasDoors: boolean,
    doorCount: number
  ) {
    const despiece = [
      { tipo: 'P', altura: 70, ancho: 60, cantidad: 2 },
      { tipo: 'P', altura: 70, ancho: width, cantidad: 1 },
      { tipo: 'P', altura: 60, ancho: width, cantidad: 2 },
    ];

    if (hasDoors) {
      despiece.push({
        tipo: 'P',
        altura: 70,
        ancho: width / doorCount,
        cantidad: doorCount,
      }); // ✅ Puertas
    }

    return despiece;
  }

  private _getDespieceEstanteria(width: number, shelfCount: number) {
    return [
      { tipo: 'P', altura: 90, ancho: 45, cantidad: 2 },
      { tipo: 'P', altura: 90, ancho: width, cantidad: 1 },
      { tipo: 'P', altura: 70, ancho: 45, cantidad: 2 },
      { tipo: 'P', altura: 70, ancho: 45, cantidad: shelfCount },
    ];
  }
}
