import { User } from "./users.interfaces";

export type MonitorViewMode = "timeline" | "horizontal" | "desktop";

export interface UsersOnDuty extends User {
  context: string[];
}
