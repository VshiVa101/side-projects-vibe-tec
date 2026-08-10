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
    playTab: () => playDOMSound('sfx-tab'),
    toggleRadio: function() {
        const bgTrack = document.getElementById('bg-radio-track');
        const toggleBtn = document.getElementById('radio-toggle-btn');
        if (!bgTrack) return false;
        
        if (bgTrack.paused) {
            bgTrack.volume = 0.5;
            bgTrack.play().then(() => {
                if (toggleBtn) toggleBtn.innerHTML = '> STATION: ONLINE [PAUSE]';
            }).catch(e => console.warn('Radio playback blocked by browser:', e));
            return true;
        } else {
            bgTrack.pause();
            if (toggleBtn) toggleBtn.innerHTML = '> STATION: OFFLINE [PLAY]';
            return false;
        }
    },
    startRadio: function() {
        const bgTrack = document.getElementById('bg-radio-track');
        const toggleBtn = document.getElementById('radio-toggle-btn');
        if (!bgTrack || !bgTrack.paused) return;
        bgTrack.volume = 0.5;
        bgTrack.play().then(() => {
            if (toggleBtn) toggleBtn.innerHTML = '> STATION: ONLINE [PAUSE]';
        }).catch(e => {
            console.warn('Radio autoplay waiting for user interaction:', e);
        });
    }
};

// Sblocco ed avvio automatico al primo click/tasto in qualunque punto del sito (Intro o Terminale)
let autoRadioStarted = false;
function handleUserInteractionAudio() {
    if (window.globalPipAudioCtx && window.globalPipAudioCtx.state === 'suspended') {
        window.globalPipAudioCtx.resume();
    }
    if (!autoRadioStarted) {
        autoRadioStarted = true;
        if (window.pipAudio && window.pipAudio.startRadio) {
            window.pipAudio.startRadio();
        }
    }
}

window.addEventListener('click', handleUserInteractionAudio);
window.addEventListener('keydown', handleUserInteractionAudio);
window.addEventListener('touchstart', handleUserInteractionAudio);
