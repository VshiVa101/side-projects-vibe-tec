// --- PIP-BOY FAIL-PROOF DUAL AUDIO ENGINE ---

function playDOMSound(audioId) {
    try {
        const el = document.getElementById(audioId);
        if (el) {
            el.currentTime = 0;
            el.volume = 1.0;
            const p = el.play();
            if (p !== undefined) {
                p.catch(e => {
                    console.warn("DOM Audio bloccato dal browser, attivo fallback sintetizzatore:", e);
                    playSynthFallback();
                });
            }
        } else {
            playSynthFallback();
        }
    } catch(e) {
        playSynthFallback();
    }
}

function playSynthFallback() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!window.globalPipAudioCtx) {
            window.globalPipAudioCtx = new AudioCtx();
        }
        const ctx = window.globalPipAudioCtx;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    } catch(err) {}
}

window.pipAudio = {
    playInitial: () => playDOMSound('sfx-initial'),
    playFocus: () => playDOMSound('sfx-focus'),
    playHighlight: () => playDOMSound('sfx-highlight'),
    playSelect: () => playDOMSound('sfx-select'),
    playTab: () => playDOMSound('sfx-tab')
};

// Sblocco automatico globale al primo click in qualunque punto
window.addEventListener('click', () => {
    if (window.globalPipAudioCtx && window.globalPipAudioCtx.state === 'suspended') {
        window.globalPipAudioCtx.resume();
    }
});
