import { User } from "./users.interfaces";

export interface ReceptionProcess {
  id: number;
  status: string;
  typeOfMaterial: string;
  isActive: boolean;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  events: Event[];
  metrics: Metric[];
}

interface Event {
  id: number;
  status: string;
  event: string;
  role: string;
  metadata: null;
  isActive: boolean;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

interface Metric {
  id: number;
  eventType: string;
  visibleAt: string;
  actionAt: Date | null;
  reactionTimeSec: number | null;
  systemDelaySec: number | null;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export enum ProcessEventOption {
  LOGISTICA_AUTORIZA_INGRESO = "LOGISTICA_AUTORIZA_INGRESO",
  CALIDAD_RECHAZA_MATERIAL = "CALIDAD_RECHAZA_MATERIAL",
  CALIDAD_APRUEBA_MATERIAL = "CALIDAD_APRUEBA_MATERIAL",
}

export enum ProcessState {
  CALIDAD_PENDIENTE_DE_CONFIRMACION_DE_ANALISIS = "CALIDAD_PENDIENTE_DE_CONFIRMACION_DE_ANALISIS",
  CALIDAD_APROBO = "CALIDAD APROBO",
  CALIDAD_RECHAZO = "CALIDAD_RECHAZO",
}
