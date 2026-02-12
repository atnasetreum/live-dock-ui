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
