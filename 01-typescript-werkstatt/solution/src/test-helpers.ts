// Hilfsfunktionen für die Tests. Du musst hier nichts ändern.

/**
 * Friert ein Objekt (und alles darin) ein. Wer danach etwas daran ändert,
 * bekommt sofort einen Fehler. So prüfen die Tests, ob eine Funktion ihre
 * Eingabe unverändert lässt.
 */
export function deepFreeze<T>(value: T): T {
  if (typeof value === 'object' && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const inner of Object.values(value)) {
      deepFreeze(inner);
    }
  }
  return value;
}
