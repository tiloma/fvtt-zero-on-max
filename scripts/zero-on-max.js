const MODULE_ID = "zero-on-max";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | init`);

  const patchFn = function (wrapped, ...args) {
    const out = wrapped(...args);

    try {
      for (const r of this.dice[0].results) {
        const max = this.dice[0].faces;
        if ((max === 20 || max === 100) && r.result === max) {
          r.result = 0;
          r.success = false;
          r.failure = false;
          r.active = true;
        }
      }
    } catch (e) {
      console.error(`${MODULE_ID} | Fehler beim Patchen`, e);
    }

    return out;
  };

  // libWrapper bevorzugt
  if (typeof libWrapper !== "undefined") {
    if (CONFIG.Dice.D20Roll) {
      libWrapper.register(
        MODULE_ID,
        "CONFIG.Dice.D20Roll.prototype._evaluateRoll",
        patchFn,
        "WRAPPER"
      );
      console.log(`${MODULE_ID} | Patched D20Roll`);
    }

    if (CONFIG.Dice.D100Roll) {
      libWrapper.register(
        MODULE_ID,
        "CONFIG.Dice.D100Roll.prototype._evaluateRoll",
        patchFn,
        "WRAPPER"
      );
      console.log(`${MODULE_ID} | Patched D100Roll`);
    }
  } else {
    // Fallback
    if (CONFIG.Dice.D20Roll) {
      const orig = CONFIG.Dice.D20Roll.prototype._evaluateRoll;
      CONFIG.Dice.D20Roll.prototype._evaluateRoll = function (...args) {
        return patchFn(orig.bind(this), ...args);
      };
    }

    if (CONFIG.Dice.D100Roll) {
      const orig = CONFIG.Dice.D100Roll.prototype._evaluateRoll;
      CONFIG.Dice.D100Roll.prototype._evaluateRoll = function (...args) {
        return patchFn(orig.bind(this), ...args);
      };
    }
  }
});
