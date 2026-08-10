# 🎮 PIP-FOLIO — Project Starter Brief

> Portfolio UX/UI Design in stile Fallout Pip-Boy.
> Questo documento è il brief tecnico-creativo specifico per questo progetto.
> Va letto **dopo** la Vibe Coding Spec generale (vibe_coding_spec.md).

---

## Il Concept

Un portfolio immersivo che replica l'esperienza del **Pip-Boy 3000** di Fallout.
L'utente atterra su un paesaggio post-apocalittico sereno (paradosso intenzionale),
clicca, e un braccio si alza rivelando il Pip-Boy. Da quel momento, tutta la navigazione
avviene dentro lo schermo verde-su-nero dell'interfaccia retrò-futuristica.

### Parole Chiave dell'Atmosfera
- **Serenità post-apocalittica** — tutto è distrutto, ma c'è pace
- **Esperienza animata** — nessuna fretta, l'utente esplora
- **Feeling rilassante** — musica anni '20 in sottofondo
- **Analogico-digitale** — la mano "tocca" i pulsanti fisici del Pip-Boy

### Pubblico Target
1. **Recruiter UX/UI e Web Design** — devono vedere processo, competenza, professionalità
2. **Artisti e Content Creator** — devono vedere creatività, storytelling, capacità tecnica fuori dal comune

---

## Architettura del Sito (Sezioni Pip-Boy)

Segue la struttura canonica di Fallout 3:

| Tab Pip-Boy | Contenuto Portfolio | Note |
|-------------|-------------------|------|
| **STAT** | Biografia / Chi sono | Presentazione personale, skill come "statistiche S.P.E.C.I.A.L." |
| **INV** | Inventario Progetti | Icone stile Fallout per ogni progetto → link a Notion per case study completo |
| **DATA** | Contatti | Email, LinkedIn, GitHub, canali di contatto |
| **MAP** | Progetti in arrivo + Come opero | Roadmap personale, metodologia di lavoro |
| **RADIO** | Elemento goliardico | Cambio musica di sottofondo del sito. Playlist anni '20 / finto notiziario post-apocalittico |

### Case Study
- I case study **NON vivono dentro il Pip-Boy** (troppo testo in verde su nero affatica la vista)
- Ogni progetto nel tab INV ha un'**icona in stile Fallout** + breve descrizione
- Click sull'icona → **apre la pagina pubblica Notion** con il case study completo
- Notion è la scelta strategica: pagine illimitate nel piano free, integrazione Figma, embed prototipi

---

## Approccio Tecnico: "Fake 3D"

### Il Layering (dal fondo verso l'utente)

```
Layer 0 (Background): Video loop 5-10s del paesaggio post-apocalittico
Layer 1 (Braccio):     PNG trasparente ad alta risoluzione del braccio + Pip-Boy
Layer 2 (UI):          Interfaccia web HTML/CSS dentro il "buco" dello schermo del Pip-Boy
```

### Come Funziona

1. **Sfondo Vivo**: Un `<video autoplay loop muted>` mostra il paesaggio animato
   - Generato con AI (Runway/Kling/Google Veo) partendo da un'immagine statica
   - Dettagli sottili: nuvole che si muovono, polvere nell'aria, erba che oscilla
   
2. **Braccio Statico-Dinamico**: Un PNG trasparente del braccio sovrapposto al video
   - Al centro dello schermo del Pip-Boy nella PNG → "buco" trasparente
   - Effetto **parallasse** via JS: leggero movimento del braccio legato al mouse
   - Ombra esterna CSS per staccare visivamente dal background
   
3. **UI Dentro lo Schermo**: HTML/CSS standard posizionato nel buco trasparente
   - Tema: verde fosforo (#18e018) su nero
   - Font: monospaced (Fixedsys, Roboto Mono, o simile)
   - Effetto CRT: scanlines e bagliore via CSS puro

### L'Intro
- Video brevissimo (pochi secondi): il braccio si alza, il Pip-Boy si accende
- **Tasto SKIP enorme e accessibile** fin dal primo secondo
- Dopo l'intro, stato stabile: braccio fermo, sfondo che respira, UI attiva

### Animazione della Mano (Post-MVP / Nice to Have)
- La mano sinistra che preme fisicamente i pulsanti del Pip-Boy ai click dell'utente
- Tecnicamente fattibile con sequenze di immagini AI-generated
- **Complessità alta** → segnata per fase successiva, non per l'MVP

---

## Stack Specifico del Progetto

| Cosa | Strumento | Costo |
|------|-----------|-------|
| Framework | **Next.js** o **React** (Vite) | Gratuito |
| Animazioni UI | **GSAP** (timing intro + parallasse) | Gratuito (base) |
| Effetto CRT | **CSS puro** (scanlines, glow, flicker) | Gratuito |
| Video sfondo | **Runway / Kling / Google Veo** | Free tier |
| Asset braccio | **AI Image Gen** (Midjourney/DALL-E) → PNG trasparente | Free tier |
| Deploy | **Vercel** o **Netlify** | Gratuito |
| Case Study | **Notion** (pagine pubbliche) | Gratuito |
| Design | **Figma** | Gratuito |

---

## Effetto CRT (CSS Reference)

```css
/* Scanlines */
.crt-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  pointer-events: none;
  z-index: 100;
}

/* Glow verde */
.pip-screen {
  color: #18e018;
  text-shadow: 0 0 5px #18e018, 0 0 10px rgba(24, 224, 24, 0.5);
  font-family: 'Roboto Mono', monospace;
}

/* Flicker sottile */
@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.97; }
}
.pip-screen { animation: flicker 0.1s infinite; }
```

---

## Precedenti e Ricerca (Competitor Analysis)

### Portfolio Pip-Boy Esistenti
- **Ansell Maximilian "Pipfolio"** (2026) — Declinazione S.P.E.C.I.A.L. per le skill
- **SlothyKernel "Pip-Boy OK-200"** — Riproduzione fedele Fallout 4, CSS puro
- **Pip-Boy.com** — Hub community con simulatore interattivo

### Riferimenti Professionali
- **Jake Raymor** (Bethesda Senior UI Artist) — Gerarchie visive ufficiali su ArtStation
- **Dribbble tag "Pipboy"** — Interpretazioni moderne e pulite

### Lezioni Apprese dalla Ricerca
1. Il verde fosforo classico funziona per i menu, ma i case study lunghi vanno su Notion (leggibilità)
2. L'effetto "testo digitato in tempo reale" aggiunge immersione senza pesare
3. Tutti i precedenti usano CSS piatto — il mio approccio braccio PNG + parallasse è superiore e più originale
4. Font monospaced per testi tecnici, ma selezionarne uno leggibile

---

## Note Legali (Copyright)

- **NON usare asset diretti di Bethesda** (musica, video, screenshot del gioco)
- **Tutti gli asset generati da AI** partendo da prompt originali → nessun rischio diretto
- **Musica**: tracce royalty-free anni '20 da archivi di pubblico dominio
- **Disclaimer obbligatorio nel footer**:
  > "Concept UI ispirata all'universo Fallout. Progetto di fan design a scopo dimostrativo.
  > Non affiliato a Bethesda Softworks."

---

## User Flow

```
[Landing]
    │
    ▼
[Video sfondo + Tasto SKIP]
    │ click anywhere / skip
    ▼
[Animazione braccio si alza → Pip-Boy si accende]
    │ 3-5 secondi
    ▼
[Home Pip-Boy: Tab STAT attivo di default]
    │
    ├── STAT → Biografia, skill come statistiche
    ├── INV  → Griglia icone progetti
    │         └── Click icona → Notion (nuova tab)
    ├── DATA → Contatti e social
    ├── MAP  → Roadmap + metodologia
    └── RADIO → Cambio musica sottofondo
```

---

## Roadmap di Implementazione

| Fase | Task | Priorità |
|------|------|----------|
| 0 | Studio di fattibilità (COMPLETATO) | ✅ |
| 1 | Generazione asset: immagine paesaggio + animazione video loop | 🔴 |
| 2 | Generazione asset: braccio + Pip-Boy (PNG trasparente) | 🔴 |
| 3 | Setup progetto (Next.js/Vite + struttura cartelle) | 🔴 |
| 4 | Implementazione Layer 0: video sfondo | ⬜ |
| 5 | Implementazione Layer 1: braccio PNG + parallasse | ⬜ |
| 6 | Implementazione Layer 2: UI Pip-Boy (scheletro 5 tab) | ⬜ |
| 7 | Effetto CRT (scanlines, glow, flicker) | ⬜ |
| 8 | Contenuti STAT (biografia) | ⬜ |
| 9 | Contenuti INV (icone + link Notion) | ⬜ |
| 10 | Contenuti DATA (contatti) | ⬜ |
| 11 | Contenuti MAP (roadmap + metodo) | ⬜ |
| 12 | Contenuti RADIO (player musica) | ⬜ |
| 13 | Intro animazione (braccio che si alza) + Skip button | ⬜ |
| 14 | Audio sottofondo (musica anni '20 royalty-free) | ⬜ |
| 15 | Testing responsive | ⬜ |
| 16 | Deploy Vercel + LinkedIn update | ⬜ |
| POST-MVP | Animazione mano che preme i pulsanti | 📝 |

---

## Progetti da Inserire (Case Study)

| Progetto | Stato | Tipo | Note |
|----------|-------|------|------|
| **Sito YouTuber/Artista** | In corso (quasi finito) | End-to-end reale | Documentato fino al midollo. Pulire file Figma prima del portfolio. |
| **Collab con Programmatore Senior** | Prossimo | Design-focused | Inserire come "Coming Soon" o per mostrare teamwork e handoff |
| **Progetti Personali** | Idee (~10) | App funzionali/gestionali | Selezionare 2-3 più forti come concept project |

---

*Versione: 1.0 — Aprile 2026*
*Ultimo aggiornamento: Studio di fattibilità completato. Prossimo step: generazione asset.*
