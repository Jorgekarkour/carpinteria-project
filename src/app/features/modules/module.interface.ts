export enum ModuleType {
  ESTANTERIA = 1,
  ENCIMERA = 2,
}
export interface Module {
  id: number;
  moduleType: ModuleType;
  height: number;
  width: number;
  action?: string;
  hasDoors?: boolean;
  doorCount?: number;
  shelfCount?: number;
}

export interface Despiece {
  tipo: string;
  altura: number;
  ancho: number;
  cantidad: number;
}
