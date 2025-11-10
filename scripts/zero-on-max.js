const MODULE_ID = "zero-on-max";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | init`);

  const DieCls = CONFIG.Dice.termTypes["d"];
  if (!DieCls) {
    console.error(`${MODULE_ID} | Konnte CONFIG.Dice.termTypes["d"] nicht finden.`);
    return;
  }

  /** Wrapper-Funktion */
  const patchEvaluate = function (wrapped, ...args) {
    const out = wrapped(...args);

    try {
      const faces = this.faces;
      if (faces === 20 || faces === 100) {
        for (const r of this.results) {
          if (r.result === faces) {
            r.result = 0;
            r.success = false;
            r.failure = false;
            r.active = true;
          }
        }
      }
    } catch (e) {
      console.error(`${MODULE_ID} | Fehler beim Umschreiben`, e);
    }

    return out;
  };

  if (typeof libWrapper !== "undefined") {
    libWrapper.register(
      MODULE_ID,
      "CONFIG.Dice.termTypes.d.prototype.evaluate",
      patchEvaluate,
      "WRAPPER"
    );
    console.log(`${MODULE_ID} | libWrapper WRAPPER aktiv (evaluate).`);
  } else {
    const original = DieCls.prototype.evaluate;
    DieCls.prototype.evaluate = function (...args) {
      return patchEvaluate(original.bind(this), ...args);
    };
    console.warn(`${MODULE_ID} | libWrapper nicht gefunden – Fallback-Patch aktiv.`);
  }
});
