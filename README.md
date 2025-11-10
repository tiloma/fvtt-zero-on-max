# Zero on Max (d20/d100) for Foundry VTT v13

**Funktion:**  
- Wenn ein `1d20`-Einzelwürfel eine **20** trifft, wird das Ergebnis auf **0** gesetzt.  
- Wenn ein `1d100`-Einzelwürfel eine **100** trifft, wird das Ergebnis auf **0** gesetzt.

Dies geschieht auf **Die-Ebene** (einzelner Würfel), nicht nur in der Chat-Ausgabe. Somit greifen auch System-Mechaniken, Makros und andere Module auf die umgeschriebenen Werte zu.

## Installation (GitHub/Forge VTT)

1. **Repository (GitHub) erstellen**  
   - GitHub: Account **tiloma**  
   - Repo-Name: `fvtt-zero-on-max`  
   - Dateien aus diesem Repo hochladen/committen.

2. **Manifest-Link (für Foundry & Forge VTT)**  
https://raw.githubusercontent.com/tiloma/fvtt-zero-on-max/main/module.json

3. **Foundry/Forge**  
- In Foundry VTT oder Forge VTT unter **Add-on Modules → Install Module → Manifest URL** den obigen Link einfügen.
- Modul aktivieren.  
- **libWrapper** sollte ebenfalls installiert/aktiv sein (wird als Abhängigkeit gelistet).

## Kompatibilität

- Getestet/ausgelegt für **Foundry v13**.  
- **libWrapper** wird bevorzugt verwendet. Ohne libWrapper greift ein Fallback-Patch.  
- Kompatibel mit gängigen Würfel-/QoL-Modulen (Dice So Nice!, Dice Tray, SocketLib, Monks-* u.a.), da die Änderung direkt bei `Die.prototype.roll` ansetzt.

> **Hinweis zu Dice So Nice!**  
> DSN visualisiert die angezeigten Zahlen. Ein `0` auf einem `d20` kann optisch ungewohnt wirken (einige Styles erwarten 1..20). Die Logik funktioniert trotzdem korrekt, da der tatsächliche Wert intern auf 0 gesetzt wird.

## Lizenz
MIT
