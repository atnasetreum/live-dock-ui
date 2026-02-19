import { DateTime } from "luxon";

const timeZone = "America/Mexico_City";

export const getCurrentDateTime = (): string => {
  return DateTime.now().setZone(timeZone).toISO() ?? "";
};

export const getCurrentDate = (): string => {
  return DateTime.now().setZone(timeZone).toISODate() ?? "";
};
