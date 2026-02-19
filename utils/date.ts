/* import { DateTime } from "luxon";

export const getCurrentDate = (): string => {
  return DateTime.now().toISODate() ?? "";
  //return DateTime.now().setZone("America/Mexico_City").toISODate() ?? "";
};
 */

const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log("Servidor:", serverTimezone);

// O usando getTimezoneOffset para obtener la diferencia en minutos
const offset = new Date().getTimezoneOffset();
console.log("Diferencia en minutos:", offset);

export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
