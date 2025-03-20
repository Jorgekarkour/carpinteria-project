import { Module } from '../modules/module.interface';

export type ColumnsKeys<T> = Array<keyof T>;

export interface Project {
  id: number;
  projectName: string;
  clientName: string;
  modules: Module[];
  action?: string;
}
