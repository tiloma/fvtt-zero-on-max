const MODULE_ID = "zero-on-max";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | init`);

  /**
   * Diese Funktion prüft das Ergebnis eines Würfels und setzt es auf 0,
   * wenn es beim d20 oder d100 das Maximum erreicht.
   */
  function adjustRoll(wrapped, ...args) {
    const out = wrapped(...args);
    try {
      const faces = this.faces;
      if ((faces === 20 || faces === 100) && out && out.result === faces) {
        out.result = 0;
        if (typeof out.exploded !== "undefined") out.exploded = false;
        if (typeof out.success !== "undefined") out.success = false;
        if (typeof out.failure !== "undefined") out.failure = false;
      }
    } catch (err) {
      console.error(`${MODULE_ID} | Fehler beim Setzen auf 0:`, err);
    }
    return out;
  }

  /**
   * Patcht alle Dice-Klassen, die das System registriert hat.
   * Das schließt auch Mothership-spezifische wie MSDie oder PSGDie ein.
   */
  const diceTerms = CONFIG?.Dice?.terms ?? {};
  for (const [key, term] of Object.entries(diceTerms)) {
    if (term?.prototype?.roll) {
      if (typeof libWrapper !== "undefined") {
        libWrapper.register(
          MODULE_ID,
          `${term.name}.prototype.roll`,
          adjustRoll,
          "WRAPPER"
        );
        console.log(`${MODULE_ID} | libWrapper Patch aktiv für ${term.name}`);
      } else {
        const original = term.prototype.roll;
        term.prototype.roll = function (...args) {
          return adjustRoll.call(this, original.bind(this), ...args);
        };
        console.warn(`${MODULE_ID} | Fallback Patch aktiv für ${term.name}`);
      }
    }
  }
});
