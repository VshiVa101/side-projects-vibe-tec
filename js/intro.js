// --- INTRO VIDEO & TRANSITION LOGIC ---

document.addEventListener("DOMContentLoaded", () => {
    const introContainer = document.getElementById('intro-container');
    const introVideo = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-btn');
    const greenFlash = document.getElementById('green-flash-overlay');
    const terminal = document.getElementById('pip-boy-terminal');

    // Se c'è un hash o query param nell'URL (navigazione di ritorno), bypassiamo completamente l'intro
    if (window.location.hash || window.location.search.indexOf('tab=') !== -1 || document.documentElement.classList.contains('skip-boot')) {
        if (introContainer) {
            introContainer.style.display = 'none';
            introContainer.classList.add('hidden-hard');
        }
        if (terminal) {
            terminal.style.display = 'flex';
        }
        return; // Interrompe il setup dell'intro
    }

    // Assicuriamo che il terminale sia nascosto all'inizio (Normale Boot)
    if (terminal) {
        terminal.style.display = 'none';
    }

    let transitionStarted = false;

    // Funzione per eseguire la transizione "Matrix Zoom + Green Flash"
    function startTransition() {
        if (transitionStarted) return;
        transitionStarted = true;

        // 1. Applica la classe di zoom estremo al video
        if (introVideo) {
            introVideo.classList.add('zooming');
        }

        // 2. Dopo 800ms di zoom (nel picco di ingrandimento e sfocatura), scatena il flash verde
        setTimeout(() => {
            if (greenFlash) {
                greenFlash.classList.add('flash');
            }

            // 3. Dopo 300ms di flash accecante, scambia i container (nascondi video, mostra terminale)
            setTimeout(() => {
                if (introContainer) {
                    introContainer.classList.add('hidden-hard');
                }
                if (terminal) {
                    terminal.style.display = 'flex';
                    if (window.pipAudio) window.pipAudio.playInitial();
                }

                // 4. Dissolvi il flash verde per rivelare l'interfaccia Pip-Boy
                setTimeout(() => {
                    if (greenFlash) {
                        greenFlash.classList.remove('flash');
                    }
                }, 100);
            }, 300);
        }, 800);
    }

    const startOverlay = document.getElementById('start-overlay');

    // --- DYNAMIC RETRO TYPEWRITER BOOT EFFECT ---
    function initTypewriterBoot() {
        const titleEl = document.querySelector('.start-brand-title');
        const subtextEl = document.querySelector('.start-brand-subtext');
        const subtitleEl = document.querySelector('.start-subtitle');
        const catContainer = document.querySelector('.start-cat-container');
        const promptEl = document.querySelector('.start-prompt');

        if (!titleEl || !subtextEl || !subtitleEl) return;

        // Salva i testi originali (preferendo l'attributo data-text per evitare sfarfallii)
        const titleText = titleEl.getAttribute('data-text') || titleEl.textContent.trim();
        const subtextText = subtextEl.getAttribute('data-text') || subtextEl.textContent.trim();
        const subtitleText = subtitleEl.getAttribute('data-text') || subtitleEl.textContent.trim();

        // Svuota i contenuti iniziali
        titleEl.textContent = '';
        subtextEl.textContent = '';
        subtitleEl.textContent = '';

        // Nascondi logo e prompt per farli comparire a fine digitazione
        if (catContainer) catContainer.classList.add('boot-element-hidden');
        if (promptEl) promptEl.classList.add('boot-element-hidden');

        // Crea il cursore verde retro terminale
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';

        // Estrai l'eventuale formato a graffe { testo } per l'effetto auto-closing delle IDE
        let subtitleInner = subtitleText;
        let hasBrackets = false;
        if (subtitleText.startsWith('{') && subtitleText.endsWith('}')) {
            hasBrackets = true;
            subtitleInner = subtitleText.slice(1, -1).trim();
        }

        const sequence = [
            { el: titleEl, text: titleText, speed: 45, pauseAfter: 160 },
            { el: subtextEl, text: subtextText, speed: 45, pauseAfter: 160 },
            { 
                el: subtitleEl, 
                text: subtitleInner, 
                isBracketMode: hasBrackets, 
                openStr: "{ ", 
                closeStr: " }", 
                speed: 35, 
                pauseAfter: 200 
            }
        ];

        let sequenceIndex = 0;
        let charIndex = 0;
        let bracketInitDone = false;
        let closeBracketNode = null;
        let typingTimeout = null;
        let isCompleted = false;

        function finishImmediately() {
            if (isCompleted) return;
            isCompleted = true;
            if (typingTimeout) clearTimeout(typingTimeout);

            titleEl.textContent = titleText;
            subtextEl.textContent = subtextText;
            subtitleEl.textContent = subtitleText;
            subtitleEl.appendChild(cursor);

            if (catContainer) catContainer.classList.remove('boot-element-hidden');
            if (promptEl) promptEl.classList.remove('boot-element-hidden');
        }

        function typeNextChar() {
            if (isCompleted) return;

            const current = sequence[sequenceIndex];
            if (!current) {
                isCompleted = true;
                // 1. Schermo e digitazione completati: rivela prima il logo del gatto
                if (catContainer) catContainer.classList.remove('boot-element-hidden');
                // 2. Rivela il tasto di inizializzazione per ultimo dopo una pausa scenica di 450ms
                setTimeout(() => {
                    if (promptEl) promptEl.classList.remove('boot-element-hidden');
                }, 450);
                return;
            }

            // Modalità IDE Auto-Closing Brackets: Genera subito { █ } ed inserisce il testo all'interno
            if (current.isBracketMode && !bracketInitDone) {
                bracketInitDone = true;
                current.el.textContent = '';
                const openNode = document.createTextNode(current.openStr);
                closeBracketNode = document.createTextNode(current.closeStr);

                current.el.appendChild(openNode);
                current.el.appendChild(cursor);
                current.el.appendChild(closeBracketNode);
                
                // Pausa scenografica immediata (140ms) dopo l'apertura automatica delle graffe
                typingTimeout = setTimeout(typeNextChar, 140);
                return;
            }

            // Se non è in bracket mode o le graffe sono già inizializzate
            if (!current.isBracketMode && !current.el.contains(cursor)) {
                current.el.appendChild(cursor);
            }

            if (charIndex < current.text.length) {
                const char = current.text.charAt(charIndex);
                const textNode = document.createTextNode(char);
                current.el.insertBefore(textNode, cursor);
                charIndex++;
                typingTimeout = setTimeout(typeNextChar, current.speed + Math.random() * 15);
            } else {
                // Se era in bracket mode, sposta il cursore oltre la graffa di chiusura a fine riga
                if (current.isBracketMode && closeBracketNode) {
                    current.el.appendChild(cursor);
                }

                sequenceIndex++;
                charIndex = 0;
                typingTimeout = setTimeout(typeNextChar, current.pauseAfter);
            }
        }

        if (startOverlay) {
            startOverlay.addEventListener('click', finishImmediately, { capture: true, once: true });
        }

        typingTimeout = setTimeout(typeNextChar, 120);
    }

    // Esegui la digitazione dinamicamente
    initTypewriterBoot();

    // Evento ZERO: Click/Tap su FIRST CLICK BOOT OVERLAY (Raccoglie il primo click fidato dell'utente!)
    if (startOverlay) {
        startOverlay.addEventListener('click', () => {
            // 1. Riproduci suono di avvio iniziale
            if (window.pipAudio) window.pipAudio.playSelect();
            
            // 2. Avvia immediatamente la radio di sottofondo e sblocca l'AudioContext
            if (window.pipAudio && window.pipAudio.startRadio) {
                window.pipAudio.startRadio();
            }

            // 3. Nascondi lo start overlay con dissolvenza
            startOverlay.classList.add('fade-out');
            setTimeout(() => {
                startOverlay.style.display = 'none';
            }, 600);

            // 4. Mostra il tasto SKIP INTRO ed avvia il video
            if (skipBtn) skipBtn.classList.remove('hidden-hard');
            if (introVideo) {
                introVideo.play().catch(e => console.warn("Video play:", e));
            }
        });
    }

    // Evento 1: Il video finisce da solo
    if (introVideo) {
        introVideo.addEventListener('ended', startTransition);
    }

    // Evento 2: Click sul pulsante SKIP
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            if (window.pipAudio && window.pipAudio.startRadio) window.pipAudio.startRadio();
            startTransition();
        });
    }

    // Evento 3: Pressione del tasto [ESC] sulla tastiera
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.code === 'Escape') {
            startTransition();
        }
    });
});
