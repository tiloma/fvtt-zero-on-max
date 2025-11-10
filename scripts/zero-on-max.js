const MODULE_ID = "zero-on-max";

/**
 * Kernlogik:
 * Wir haken uns in den einzelnen Die-Wurf ein (Die.prototype.roll).
 * Wenn ein Wurf das "Maximum" (faces) trifft und faces ∈ {20, 100}, setzen wir result = 0.
 * Das geschieht auf Ebene der Einzeldice, bevor Summen und Meta-Infos finalisiert werden.
 */
Hooks.once("init", () => {
  console.log(`${MODULE_ID} | init`);

  // Sicherstellen, dass wir die Die-Klasse erwischen (Foundry v10+)
  const DieCls = CONFIG?.Dice?.terms?.d;
  if (!DieCls || !DieCls.prototype?.roll) {
    console.error(`${MODULE_ID} | Konnte CONFIG.Dice.terms.d.prototype.roll nicht finden. Abbruch.`);
    return;
  }

  /** Wrapper-Implementierung */
  const wrapRoll = function (wrapped, ...args) {
    const out = wrapped(...args);
    try {
      // "this" ist die konkrete Die-Instanz (z.B. d20, d100)
      const faces = this.faces;

      // Bei d20 und d100: wenn Ergebnis == Maximum, Ergebnis auf 0 setzen.
      if ((faces === 20 || faces === 100) && out && out.result === faces) {
        out.result = 0;

        // Falls Flags existieren (Explosionen/Erfolg/Fehlschlag), neutralisieren.
        if (typeof out.exploded !== "undefined") out.exploded = false;
        if (typeof out.success !== "undefined") out.success = false;
        if (typeof out.failure !== "undefined") out.failure = false;
      }
    } catch (e) {
      console.error(`${MODULE_ID} | Fehler beim Umschreiben eines Max-Wurfs`, e);
    }
    return out;
  };

  // Bevorzugt libWrapper benutzen, falls vorhanden
  if (typeof libWrapper !== "undefined") {
    libWrapper.register(
      MODULE_ID,
      "CONFIG.Dice.terms.d.prototype.roll",
      wrapRoll,
      "WRAPPER"
    );
    console.log(`${MODULE_ID} | libWrapper aktiv – Dice-Roll WRAPPER registriert.`);
  } else {
    // Fallback: sanftes Monkey-Patching
    const original = DieCls.prototype.roll;
    DieCls.prototype.roll = function (...args) {
      return wrapRoll(original.bind(this), ...args);
    };
    console.warn(`${MODULE_ID} | libWrapper nicht gefunden – Fallback-Patch aktiv.`);
  }
});
