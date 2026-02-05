import { User } from "./users.interfaces";

export interface UsersOnDuty extends User {
  context: string[];
}
