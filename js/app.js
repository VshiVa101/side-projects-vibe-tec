document.addEventListener("DOMContentLoaded", () => {
    // Gestione Orologio in tempo reale e Data 2326
    function updateClock() {
        const clockEl = document.getElementById('real-time-clock');
        const dateEl = document.querySelector('.apocalyptic-date');
        if (clockEl) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            clockEl.textContent = `${hours}:${minutes}:${seconds}`;
            
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            if (dateEl) {
                dateEl.textContent = ` - ${day}.${month}.2326`;
            }
        }
    }
    setInterval(updateClock, 1000);
    updateClock(); // Inizializza subito al caricamento

    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // 1. Gestione Navigazione Tab Principali (STAT, INV, ecc.) -> ui_pipboy_select.wav
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.pipAudio) window.pipAudio.playSelect();
            navButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            btn.classList.add('active');
            
            const targetId = btn.getAttribute('data-target');
            const targetTab = document.getElementById(targetId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // 2. Gestione Sotto-Tab (STATUS, SPECIAL, PERKS) -> ui_pipboy_tab.wav
    const subNavButtons = document.querySelectorAll('.sub-nav-btn');
    const subTabContents = document.querySelectorAll('.sub-tab-content');
    const avatarImg = document.getElementById('stat-avatar');
    const projectionArea = document.getElementById('special-projection');
    const projectedLogo = document.getElementById('projected-logo');
    const specialDescBanner = document.getElementById('special-desc-banner');

    // SVG dei loghi ufficiali per la proiezione
    const techLogos = {
        antigravity: `<svg viewBox="-10 -10 120 120"><path d="M50 10 C50 32, 68 50, 90 50 C68 50, 50 68, 50 90 C50 68, 32 50, 10 50 C32 50, 50 32, 50 10 Z" fill="none" stroke="#1bfd02" stroke-width="4"/><circle cx="50" cy="50" r="10" fill="#1bfd02"/></svg>`,
        notion: `<svg viewBox="-30 -30 572 572"><rect x="48" y="48" width="416" height="416" rx="40" fill="none" stroke="#1bfd02" stroke-width="24"/><path fill="none" stroke="#1bfd02" stroke-width="24" stroke-linejoin="round" d="M136 128h60l140 180V128h40v256h-56L176 198v186h-40Z"/></svg>`,
        figma: `<svg viewBox="-4 -4 38 53" fill="rgba(27, 253, 2, 0.15)" stroke="#1bfd02" stroke-width="2"><path d="M15 0H7.5a7.5 7.5 0 0 0 0 15H15V0z"/><circle cx="22.5" cy="7.5" r="7.5"/><path d="M15 15H7.5a7.5 7.5 0 0 0 0 15H15V15z"/><circle cx="22.5" cy="22.5" r="7.5"/><path d="M15 30H7.5a7.5 7.5 0 0 0 0 15 7.5 7.5 0 0 0 7.5-7.5V30z"/></svg>`,
        html: `<svg viewBox="-30 -30 572 572"><path fill="none" stroke="#1bfd02" stroke-width="24" d="M71 460L30 0h452l-41 460-185 52z"/><text x="256" y="370" font-family="'Share Tech Mono', monospace" font-size="280" fill="#1bfd02" text-anchor="middle" font-weight="bold">5</text></svg>`,
        css: `<svg viewBox="-30 -30 572 572"><path fill="none" stroke="#1bfd02" stroke-width="24" d="M71 460L30 0h452l-41 460-185 52z"/><text x="256" y="370" font-family="'Share Tech Mono', monospace" font-size="280" fill="#1bfd02" text-anchor="middle" font-weight="bold">3</text></svg>`,
        js: `<svg viewBox="-30 -30 572 572"><rect x="32" y="32" width="448" height="448" rx="32" fill="none" stroke="#1bfd02" stroke-width="24"/><path fill="none" stroke="#1bfd02" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" d="M180 390c-25 0-42-15-42-38h32c0 8 7 14 15 14s14-6 14-18V220h35v134c0 24-18 36-54 36zm140 0c-35 0-56-18-62-42h32c5 12 14 18 30 18 14 0 22-7 22-16 0-9-8-14-25-18l-12-3c-32-8-48-22-48-46 0-28 24-45 56-45 30 0 50 14 56 36h-31c-4-9-12-13-25-13-13 0-20 6-20 14 0 8 7 12 23 16l12 3c35 9 51 22 51 47 0 31-25 49-59 49z"/></svg>`
    };

    const techDescs = {
        antigravity: "> ANTIGRAVITY [9/10]<br>Early AI pioneer (adopting models since the GPT-3 era) following Google AI standards. Expert Human2AI communicator using Antigravity for E2E project development (e.g. Neo-One Art), system-level OS/Drive/Notion orchestration, and continuous active learning.",
        notion: "> NOTION [9/10]<br>My Second Brain. Used to structure my entire life: project management, habit tracking, complex documentation, and AI-integrated workflow orchestration.",
        figma: "> FIGMA [7/10]<br>Used for static wireframes, Atomic Design, and Style Guides. I believe the future of design lies in live functional AI prototyping, focusing my energy on real working outputs while continuously honing Figma as an industry baseline.",
        html: "> HTML5 [8/10]<br>Coding journey started before the AI era to become a Full-Stack developer. Solid foundation in semantic web architecture, serving as an essential base before finding my true calling (Ikigai) in UX Design.",
        css: "> CSS3 [8/10]<br>Mastery of layout and visual styling. Guided by Don Norman's Emotional Design philosophy, I craft complex interfaces, micro-animations, and visual systems that blend structural rigor with deep emotional resonance.",
        js: "> JAVASCRIPT [7/10]<br>Solid grasp of programming logic, DOM event handling, and audio engines. I leverage AI to accelerate development while maintaining full engineering control over core logic."
    };

    subNavButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.pipAudio) window.pipAudio.playTab();
            subNavButtons.forEach(b => b.classList.remove('active'));
            subTabContents.forEach(t => t.classList.remove('active', 'hidden'));
            
            subTabContents.forEach(t => t.classList.add('hidden'));

            btn.classList.add('active');

            const targetSubId = btn.getAttribute('data-sub');
            const targetSubTab = document.getElementById(`sub-${targetSubId}`);
            if (targetSubTab) {
                targetSubTab.classList.remove('hidden');
                targetSubTab.classList.add('active');
            }

            // Se siamo in SPECIAL, nascondi l'avatar e proietta il logo 3D + Descrizione
            if (targetSubId === 'special') {
                avatarImg.classList.add('hidden');
                projectionArea.classList.remove('hidden');
                if (specialDescBanner) specialDescBanner.classList.remove('hidden');
                
                // Popola con il logo attivo di default (Antigravity)
                const activeItem = document.querySelector('.special-item.active');
                if (activeItem) {
                    const tech = activeItem.getAttribute('data-tech');
                    projectedLogo.innerHTML = techLogos[tech] || '';
                    if (specialDescBanner) specialDescBanner.innerHTML = techDescs[tech] || '';
                }
            } else {
                // Altrimenti mostra l'avatar e nascondi la proiezione/descrizione
                projectionArea.classList.add('hidden');
                if (specialDescBanner) specialDescBanner.classList.add('hidden');
                
                // Se siamo in PERKS usa l'avatar kawaii col gatto sulla spalla, altrimenti usa l'avatar originale
                if (targetSubId === 'perks') {
                    avatarImg.src = 'assets/img/perks_avatar.jpg?v=26.0';
                } else {
                    avatarImg.src = 'assets/img/avatar_v3.jpg?v=26.0';
                }
                avatarImg.classList.remove('hidden');
            }
        });
    });

    // 3. Gestione Elementi Interni (Tech Stack SPECIAL, Liste Progetti, ecc.) -> ui_pipboy_highlight.wav
    const specialItems = document.querySelectorAll('.special-item');
    specialItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.pipAudio) window.pipAudio.playHighlight();
            specialItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const tech = item.getAttribute('data-tech');
            projectedLogo.innerHTML = techLogos[tech] || '';
            if (specialDescBanner) specialDescBanner.innerHTML = techDescs[tech] || '';
        });
    });

    const projectItems = document.querySelectorAll('.project-list li');
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.pipAudio) window.pipAudio.playHighlight();
        });
    });

    // 4. Gestione HOVER col mouse su tutti gli elementi interattivi -> ui_menu_focus.wav
    const interactiveElements = document.querySelectorAll('button, .nav-btn, .sub-nav-btn, .special-item, .project-list li, #skip-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (window.pipAudio) window.pipAudio.playFocus();
        });
    });
});
