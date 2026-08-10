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

    // Evento 1: Il video finisce da solo
    if (introVideo) {
        introVideo.addEventListener('ended', startTransition);
        // Avvio automatico in mute per garantire riproduzione istantanea su tutti i browser
        introVideo.muted = true;
        introVideo.play().catch(e => {
            console.warn("Autoplay video:", e);
        });
    }

    // Evento 2: Click sul pulsante SKIP
    if (skipBtn) {
        skipBtn.addEventListener('click', startTransition);
    }

    // Evento 3: Pressione del tasto [ESC] sulla tastiera
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.code === 'Escape') {
            startTransition();
        }
    });
});
