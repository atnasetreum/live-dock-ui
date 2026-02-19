import { DateTime } from "luxon";

export const getCurrentDate = (): string => {
  return DateTime.now().setZone("America/Mexico_City").toISODate() ?? "";
};
