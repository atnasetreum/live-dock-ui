export enum ProcessEventRole {
  VIGILANCIA = "VIGILANCIA",
  LOGISTICA = "LOGISTICA",
  CALIDAD = "CALIDAD",
  PRODUCCION = "PRODUCCION",
  SISTEMA = "SISTEMA",
  ADMIN = "ADMIN",
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: ProcessEventRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
