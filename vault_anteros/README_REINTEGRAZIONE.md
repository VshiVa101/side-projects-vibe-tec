# 🗄️ VAULT ANTEROS — ARCHIVIO E GUIDA DI REINTEGRAZIONE

> **Stato**: Archiviato temporaneamente su richiesta di Leonardo Sorrentino.  
> **Obiettivo**: Mantenere il portfolio pulito e focalizzato su contratti e assunzioni (UX Designer Junior / Front-End / Web) senza distrazioni o bias cognitivi da parte dei selezionatori, preservando al 100% l'asset grafico, il layout e il codice pronto all'uso.

---

## 📁 CONTENUTO DI QUESTO VAULT

1. **`inv_classified_icon.jpg`**: L'icona originale con Leonardo in trench coat e il gattino putto trinoculare con freccia di Cupido.
2. **`anteros_tab_snippet.html`**: Il blocco HTML completo contenente sia il bottone per la barra di navigazione che l'intera card/sezione collassabile.
3. **`anteros_styles.css`**: Tutte le definizioni CSS (variante rossa CRT, keyframe di pulsazione dell'icona freccia, status box).

---

## 🚀 GUIDA: COME REINTEGRARE LA PAGINA IN 2 MINUTI

Quando vorrai reinserire Anteros in `pip-folio`:

### Passo 1: Verifica che l'immagine sia in `assets/img/`
Assicurati che `inv_classified_icon.jpg` sia presente in `assets/img/inv_classified_icon.jpg` (è già lì, ma se serve puoi ricopiarla da questo folder).

### Passo 2: Aggiungi il pulsante nel sottomenu di `index.html`
Cerca in `index.html` il blocco `<div class="sub-nav">` dentro `<div id="inv">` e aggiungi il pulsante:
```html
<button class="inv-sub-btn" data-inv="classified">ANTEROS</button>
```

### Passo 3: Inserisci il container della scheda in `index.html`
Subito prima della chiusura `</div>` di `<!-- TAB: INV -->` (dopo la fine del sub-tab `ideas`), incolla il blocco presente in `anteros_tab_snippet.html`:
```html
<!-- SUB-TAB: CLASSIFIED -->
<div id="inv-sub-classified" class="inv-sub-content hidden">
    <div class="inv-desc-banner classified-banner">
        <div class="inv-banner-header">
            <div class="inv-banner-title-col">
                <button class="inv-toggle-btn" aria-expanded="false" aria-controls="inv-desc-classified">
                    <span class="inv-toggle-icon">▶</span>
                    <span class="inv-toggle-title">> VIBE-TEC ANTEROS</span>
                </button>
                <div class="inv-section-status">[STATUS: CLASSIFIED // TOP SECRET R&D]</div>
            </div>
            <div class="inv-banner-icon-col">
                <div class="project-icon-box-large" title="Vibe-Tec Anteros: Classified Trench Coat & Cupid Putto 3-Eyed Cat">
                    <img src="assets/img/inv_classified_icon.jpg" alt="Leonardo opening trench coat with sunglasses and 3-eyed putto cat shooting Cupid arrow" class="avatar-svg" style="object-fit: cover;">
                </div>
            </div>
        </div>
        <div id="inv-desc-classified" class="inv-desc-collapsible">
            <div class="inv-desc-body">
                Advanced local architecture for AI visual orchestration (video and photo synth). An active R&D project protected under industrial confidentiality and non-disclosure agreements. This section does not host public project listings — all prototypes are developed under strict NDA for private clients.
                <span class="inv-highlight">> ACCESS RESTRICTED: ████████████████████</span>
                <span class="inv-highlight">Due to IP rights and industrial confidentiality, commercial specifications and live demonstrations are strictly accessible via private briefing upon direct contact.</span>
                <button class="inv-briefing-btn" onclick="document.querySelector('[data-target=\'data\']').click()">> REQUEST PRIVATE BRIEFING (CONTACT)</button>
            </div>
        </div>
    </div>
</div>
```

### Passo 4: Fatto!
Il sistema JavaScript di `app.js` riconosce automaticamente tutti i pulsanti `.inv-sub-btn` e i container associati `inv-sub-classified` senza dover modificare una singola riga di codice JS.

---
*Archiviato con cura da Antigravity per Leonardo Sorrentino.*
