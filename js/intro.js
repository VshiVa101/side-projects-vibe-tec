// --- INTRO VIDEO & TRANSITION LOGIC ---

document.addEventListener("DOMContentLoaded", () => {
    const introContainer = document.getElementById('intro-container');
    const introVideo = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-btn');
    const greenFlash = document.getElementById('green-flash-overlay');
    const terminal = document.getElementById('pip-boy-terminal');

    // Assicuriamo che il terminale sia nascosto all'inizio
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
