export const INFO = "info";
export const WARNING = "warning";
export const ERROR = "error";

export class ApiError extends Error {
  level: string;

  constructor(
    level: string = ERROR,
    message = "Ein unbekannter Fehler ist aufgetreten, bitte den Administrator informieren.",
    cause: Error,
    ...params: any[]
  ) {
    // Übergibt die verbleibenden Parameter (einschließlich Vendor spezifischer Parameter) dem Error Konstruktor
    super(...params);

    // Behält den richtigen Stack-Trace für die Stelle bei, an der unser Fehler ausgelöst wurde
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    // Benutzerdefinierte Informationen
    this.level = level;
    this.message = message;
    this.cause = cause;
  }
}
