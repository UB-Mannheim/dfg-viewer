# Cover im Sichtbereich halten – Verhalten & Debug-Funktionen

Diese Dokumentation beschreibt die Funktion, mit der das Cover (Facsimile) beim
Vergrößern / Verkleinern / Verschieben **im freien Bereich des sichtbaren
Bereichs** gehalten wird, sowie die eingebauten Debug-Hilfen zum Prüfen des
Verhaltens.

- **Feature-Code:** `initCoverFreeAreaClamping()` in
  `Resources/Private/JavaScript/dfgviewerScripts.js`
- **Build-Bundle:** `Resources/Public/JavaScript/allScripts.js` (via Grunt)

---

## Verhalten

Bei jedem Seitenaufruf wird der freie Bereich des Karten-Viewports dynamisch
gemessen (CSS-Pixel, zur Laufzeit). Daraus ergibt sich die Regel:

> Das Cover darf so positioniert werden, dass es **innerhalb des freien
> Bereichs** bleibt bzw. den freien Bereich **vollständig überdeckt** – je
> nachdem, ob es kleiner oder größer ist als dieser.

„Freier Bereich" = Karten-Viewport **minus**

| Blockierte Fläche | Element | Nur zählend, wenn … |
|---|---|---|
| Linke Navigation (TOC + Metadaten) | `.control-bar` | sie überlappt den Viewport (`offsetWidth > 0`) |
| Volltext-Bereich | `#tx-dlf-toolbox-fulltext-selection` / `.tx-dlf-toolbox-fulltext-container` | offen (Body-Klasse `fulltext-visible`) |

### Zwei Fälle

1. **Cover kleiner als freier Bereich**
   Das Cover muss vollständig **innerhalb** des freien Bereichs liegen.
   Es darf nie unter die Navigation oder den Volltext-Bereich hineinragen;
   rundherum darf dabei freier Hintergrund übrig bleiben.

2. **Cover größer als freier Bereich**
   Das Cover muss den freien Bereich **vollständig überdecken**. Unter der
   Navigation oder dem Volltext darf nichts „frei" werden (keine Lücke).

### Wann wird korrigiert?

Die Ansicht wird **nur im Ruhezustand** nachjustiert – also, sobald

- eine Zoom-Animation (Buttons `+` / `-`, Tastatur) gerade **abgelaufen** ist,
- ein manuelles Verschieben (Drag) beendet wurde,
- das Layout sich geändert hat (Volltext öffnen/schließen, Fullscreen,
  Fenstergröße, Navigation einklappen).

Während einer laufenden Animation/Interaktion läuft das native
View-Verhalten unverändert weiter – dadurch bleiben Zoom-Faktor und
Pan-Geschwindigkeit unverzerrt (keine Sprünge, kein Flackern).

### Was ist zu beachten?

- Beim manuellen Verschieben (ohne Zoom) ist der mögliche Bewegungsfreiraum
  begrenzt:
  - horizontal: `coverW − freieBreite` bzw. `freieBreite − coverW` (je nach
    Fall 1/2)
  - vertikal: `coverH − viewportHöhe` bzw. `viewportHöhe − coverH`
  - Ein Deckblatt, das den freien Bereich gerade eben überdeckt, hat
  entsprechenden Spielraum **nicht** – das ist gewolltes Verhalten von
  Variante A, kein Bug.
- Die Funktion ist deaktiviert (kein Clamping), solange das Cover rotiert
  ist (`getRotation() != 0`).

---

## Debug-Hilfen

Zum Testen können in den Viewer ein **Debug-Overlay** und **Test-Hooks**
eingebunden werden. Diese sind standardmäßig ausgeblendet und aktivieren
sich wie folgt.

### Aktivierung

| Methode | Befehl |
|---|---|
| **URL-Parameter** | an die Seite `?coverdebug=1` hängen |
| **Tastenkombination** | `Ctrl/Cmd + Shift + D` |
| **Browser-Konsole** | `window.__coverDebug(true)` / `window.__coverDebug(false)` |

> **Wichtig:** Nach einer Code-Änderung muss die Seite neu geladen
> werden (Browser-Cache!). Das Bundle `allScripts.js` wird bei einer
> Änderung unter `Resources/Private/JavaScript/dfgviewerScripts.js`
> neu gebaut – siehe „Build aktualisieren" unten.

### Was zeigt das Overlay?

Das Debug-Overlay malt einen Rahmen um den Karten-Viewport mit
farbgemarkten Bereichen:

```
  ROTE Box links            → blockierte Fläche: linke Navigation (TOC + Metadata)
  ORANGE Box rechts         → blockierte Fläche: Volltext-Bereich (nur, wenn offen)
  GRÜNE gestrichelte Box    → freier, nutzbarer Bereich
  BLAUES Band (horizontal)  → das Cover im Viewport (vertikaler Streifen)
    · 2 blaue Kanten im Band → linke bzw. rechte Cover-Kante
  TEXTFELD unten links      → Live-Messwerte
```

Zusätzlich werden im Textfeld (unten links) die aktuellen Messwerte angezeigt:

```
CLAMP-X / CLAMP-Y   → ist gerade eine X- bzw. Y-Korrektur aktiv?
freier Bereich      → Breite x Höhe in CSS-Pixel, inkl. Anteile Navigation/Volltext
Cover               → Breite x Höhe im Viewport in CSS-Pixel
slack               → positive Zahl = das Cover kann (noch) weiter verschoben
                      werden; negative Zahl = das Cover überdeckt den freien
                      Bereich (Korrektur wird nur eingeschnitten, wenn nötig)
Position            → obere linke Ecke des Covers relativ zur Karten-Viewport-
                      Ecke (oben-links = 0,0)
```

### Was sollte man testen?

1. **Navigation als Blocker**
   - Overlay anzeigen (`?coverdebug=1`).
   - Die rote Box links sollte die Breite der `.control-bar` zeigen
     (z. B. 25 % auf Desktop, 33 % auf Tablet-Landscape).
   - Cover heranzoomen (`+`), bis es den freien Bereich überdeckt.
   - Das Cover nach rechts verschieben (Drag).
     → Es sollte erst an der rechten Kante der grünen Box stoppen (slack = 0).

2. **Volltext-Bereich als Blocker**
   - Volltext öffnen (Button in der Toolbar) mit `?coverdebug=1`.
   - Die orange Box rechts sollte sichtbar sein.
   - Cover heranzoomen und nach links verschieben.
     → Das Cover sollte erst an der linken Kante der grünen Box stoppen.
   - Volltext schließen → orange Box verschwindet, grüne Box wird breiter,
     das Cover kann weiter nach links.

3. **Kleines Cover innerhalb der freien Fläche**
   - Weit herausszoomen (Cover deutlich kleiner als die freie Fläche).
   - Das Overlay zeigt ein kleines blaues Band innerhalb der grünen Box.
   - Das Cover lässt sich innerhalb der grünen Box frei schieben; an den
     Rändern erreicht der slack den Wert 0 und das Cover wird dort "eingeklinkt"
     (hält).

4. **Beide Zoom-Richtungen (Symmetrie prüfen)**
   - Ohne Overlay, normales Zoomen mit `+` / `-`.
   - Beide Richtungen sollten gleichmäßig und ohne Sprünge sein, da nur im
     Ruhezustand geclemt wird.

5. **Navigation einklappen / Fullscreen**
   - Navigation einklappen (Button) → rote Box schrumpft, grüne Box wächst,
     das Cover kann neu positioniert werden.
   - Fullscreen aktivieren → alle Boxen passen sich sofort an.

### Build aktualisieren

Nach einer Änderung an
`Resources/Private/JavaScript/dfgviewerScripts.js` muss das Bundle neu
gebaut werden, damit die Änderung wirksam wird:

```bash
cd <pfad>/dfg-viewer
npx grunt --gruntfile Build/Gruntfile.js docker
```

Das erzeugt ein neues `Resources/Public/JavaScript/allScripts.js`.
Danach die Seite im Browser hart neu laden (Cache leeren).

---

## Quellen

| Datei | Zweck |
|---|---|
| `Resources/Private/JavaScript/dfgviewerScripts.js` | Feature-Code + Debug-Overlay |
| `Resources/Public/JavaScript/allScripts.js` | gebautes Bundle (läuft im Browser) |
| `Resources/Private/Less/structure.less` | Layout des Karten-Bereichs (`.tx-dlf-map`, `.document-view`) |
| `Resources/Private/Less/modules/sidebar.less` | Layout der linken Navigation (`.control-bar`) |
| `Resources/Private/Less/modules/fulltext.less` | Layout des Volltext-Bereichs |
