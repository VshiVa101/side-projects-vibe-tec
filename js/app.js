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
    const disclaimerBtn = document.getElementById('disclaimer-toggle-btn');
    const disclaimerDrawer = document.getElementById('disclaimer-drawer');

    function updateFooterDisclaimerVisibility() {
        const disclaimerBtn = document.getElementById('disclaimer-toggle-btn');
        const disclaimerDrawer = document.getElementById('disclaimer-drawer');
        const mapStatus = document.getElementById('map-footer-status');
        const dataTab = document.getElementById('data');
        const mapTab = document.getElementById('map');

        const isDataActive = dataTab && dataTab.classList.contains('active');
        const isMapActive = mapTab && mapTab.classList.contains('active');

        if (disclaimerBtn && disclaimerDrawer) {
            if (isDataActive) {
                document.body.classList.add('data-tab-active');
                disclaimerBtn.style.display = 'inline-block';
            } else {
                document.body.classList.remove('data-tab-active');
                disclaimerBtn.style.display = 'none';
                disclaimerDrawer.style.display = 'none';
                disclaimerDrawer.classList.remove('open');
                disclaimerBtn.classList.remove('active');
            }
        }

        if (mapStatus) {
            if (isMapActive) {
                document.body.classList.add('map-tab-active');
                mapStatus.style.display = 'inline-flex';
            } else {
                document.body.classList.remove('map-tab-active');
                mapStatus.style.display = 'none';
            }
        }
    }

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

            updateFooterDisclaimerVisibility();
        });
    });

    updateFooterDisclaimerVisibility();

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
        antigravity: "> ANTIGRAVITY<br>Early AI pioneer (adopting models since the GPT-3 era) following Google AI standards. Expert Human2AI communicator using Antigravity for E2E project development (e.g. Neo-One Art), system-level OS/Drive/Notion orchestration, and continuous active learning.",
        notion: "> NOTION<br>My Second Brain. Used to structure my entire life: project management, habit tracking, complex documentation, and AI-integrated workflow orchestration.",
        figma: "> FIGMA<br>Used for static wireframes, Design Tokens, and UI Layouts. I believe the future of design lies in live functional AI prototyping, focusing my energy on real working outputs while continuously honing Figma as an industry baseline.",
        html: "> HTML5<br>Coding journey started before the AI era to become a Full-Stack developer. Solid foundation in semantic web architecture, serving as an essential base before finding my true calling (Ikigai) in UX Design.",
        css: "> CSS3<br>Mastery of layout and visual styling. Guided by Don Norman's Emotional Design philosophy, I craft complex interfaces, micro-animations, and visual systems that blend structural rigor with deep emotional resonance.",
        js: "> JAVASCRIPT<br>Solid grasp of programming logic, DOM event handling, and audio engines. I leverage AI to accelerate development while maintaining full engineering control over core logic."
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

            // Reset all toggle descriptions when switching sub-tabs
            document.querySelectorAll('#stat .inv-toggle-btn, .special-item-header').forEach(t => t.setAttribute('aria-expanded', 'false'));
            document.querySelectorAll('#stat .inv-desc-collapsible, .special-mobile-container').forEach(d => d.classList.remove('expanded'));

            // Sposta statRight indietro al statLayout se era in un accordion mobile
            const statRight = document.querySelector('.stat-right');
            const statLayout = document.querySelector('.stat-layout');
            if (statRight && statLayout && statRight.parentElement !== statLayout) {
                statLayout.appendChild(statRight);
            }

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
                // STATUS o PERKS: mostra l'avatar e nascondi la proiezione/descrizione
                projectionArea.classList.add('hidden');
                if (specialDescBanner) specialDescBanner.classList.add('hidden');
                
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
        item.addEventListener('click', (e) => {
            // Se il clic proviene dall'interno del container espanso (es. testo o stat-right), ignoralo
            if (e.target.closest('.special-mobile-container')) return;

            if (window.pipAudio) window.pipAudio.playHighlight();
            specialItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const tech = item.getAttribute('data-tech');
            projectedLogo.innerHTML = techLogos[tech] || '';
            if (specialDescBanner) specialDescBanner.innerHTML = techDescs[tech] || '';

            // Gestione layout mobile/ridotto (come PERKS ma sopra il toggle)
            if (window.innerWidth <= 768) {
                const header = item.querySelector('.special-item-header');
                const targetDesc = item.querySelector('.special-mobile-container');
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                
                // Chiudi tutti gli altri
                document.querySelectorAll('.special-item-header').forEach(h => h.setAttribute('aria-expanded', 'false'));
                document.querySelectorAll('.special-mobile-container').forEach(c => c.classList.remove('expanded'));

                if (!isExpanded) {
                    header.setAttribute('aria-expanded', 'true');
                    targetDesc.classList.add('expanded');
                    
                    const statRight = document.querySelector('.stat-right');
                    if (statRight) {
                        targetDesc.appendChild(statRight);
                    }
                } else {
                    // Se lo stiamo chiudendo, rimettiamo stat-right nel stat-layout
                    const statRight = document.querySelector('.stat-right');
                    const statLayout = document.querySelector('.stat-layout');
                    if (statRight && statLayout) {
                        statLayout.appendChild(statRight);
                    }
                }
            }
        });
    });

    // 1. Gestione Sotto-Schede INVENTORY (SOLO E2E, CONTRACTS, LIFE MISSION, CLASSIFIED)
    const invSubButtons = document.querySelectorAll('.inv-sub-btn');
    const invSubContents = document.querySelectorAll('.inv-sub-content');

    invSubButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.pipAudio) window.pipAudio.playTab();
            invSubButtons.forEach(b => b.classList.remove('active'));
            invSubContents.forEach(c => c.classList.add('hidden'));
            // Reset all toggle descriptions when switching sub-tabs
            document.querySelectorAll('.inv-toggle-btn').forEach(t => t.setAttribute('aria-expanded', 'false'));
            document.querySelectorAll('.inv-desc-collapsible').forEach(d => {
                d.classList.remove('expanded');
            });
            
            btn.classList.add('active');
            const targetInv = btn.getAttribute('data-inv');
            const targetContent = document.getElementById(`inv-sub-${targetInv}`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('active');
            }
        });
    });
    // 1b. Gestione Toggle Descrizione nelle sotto-schede INV (clic sull'intero banner header)
    const invBannerHeaders = document.querySelectorAll('.inv-banner-header');

    invBannerHeaders.forEach(header => {
        header.addEventListener('click', () => {
            if (window.pipAudio) window.pipAudio.playSelect();
            const btn = header.querySelector('.inv-toggle-btn');
            if (!btn) return;
            const targetId = btn.getAttribute('aria-controls');
            const targetDesc = document.getElementById(targetId);
            if (!targetDesc) return;

            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            const isPerk = header.closest('.perks-accordion') !== null;
            const statRight = document.querySelector('.stat-right');
            const statLayout = document.querySelector('.stat-layout');

            if (isExpanded) {
                btn.setAttribute('aria-expanded', 'false');
                targetDesc.classList.remove('expanded');
                
                // Se chiudiamo un perk, ripristiniamo l'avatar di default dei perks
                if (isPerk) {
                    const avatarImg = document.getElementById('stat-avatar');
                    if (avatarImg) {
                        avatarImg.src = 'assets/img/perks_avatar.jpg?v=26.0';
                    }
                    
                    // Ripristiniamo la posizione originale dell'immagine
                    if (statRight && statLayout) {
                        statLayout.appendChild(statRight);
                    }
                }
            } else {
                // Se è un perk, chiudiamo prima tutti gli altri
                if (isPerk) {
                    const allPerkBtns = document.querySelectorAll('.perks-accordion .inv-toggle-btn');
                    const allPerkDescs = document.querySelectorAll('.perks-accordion .inv-desc-collapsible');
                    allPerkBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
                    allPerkDescs.forEach(d => d.classList.remove('expanded'));

                    // Aggiorniamo l'immagine dell'avatar in base al perk.
                    // Per ora uso il targetId come placeholder (es: perk-desc-1.jpg)
                    const avatarImg = document.getElementById('stat-avatar');
                    if (avatarImg) {
                        avatarImg.src = `assets/img/${targetId}.jpg?v=${Date.now()}`;
                    }
                    
                    // Spostiamo stat-right dentro il perk selezionato se su mobile
                    if (statRight && window.innerWidth <= 768) {
                        const descBody = targetDesc.querySelector('.inv-desc-body');
                        if (descBody) {
                            targetDesc.insertBefore(statRight, descBody);
                        }
                    } else if (statRight && statLayout) {
                        // Altrimenti lo teniamo nella posizione di default
                        statLayout.appendChild(statRight);
                    }
                }

                btn.setAttribute('aria-expanded', 'true');
                targetDesc.classList.add('expanded');
            }
        });
    });

    // 2. Gestione Accordion Toggle per singoli progetti all'interno di ciascuna sotto-scheda
    const accordionHeaders = document.querySelectorAll('.project-accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            if (window.pipAudio) window.pipAudio.playSelect();
            const parentItem = header.closest('.project-accordion-item');
            const body = parentItem.querySelector('.project-accordion-body');
            
            if (parentItem.classList.contains('active')) {
                parentItem.classList.remove('active');
                if (body) body.classList.add('hidden');
            } else {
                parentItem.classList.add('active');
                if (body) body.classList.remove('hidden');
                if (typeof window.initNeoEye === 'function') {
                    setTimeout(window.initNeoEye, 150);
                }
            }
        });
    });

    // Gestione Radio Toggle Button
    const radioToggleBtn = document.getElementById('radio-toggle-btn');
    if (radioToggleBtn) {
        radioToggleBtn.addEventListener('click', () => {
            if (window.pipAudio) {
                window.pipAudio.playSelect();
                window.pipAudio.toggleRadio();
            }
        });
    }

    // Gestione Radio Volume Slider
    const volumeSlider = document.getElementById('radio-volume-slider');
    const volumeVal = document.getElementById('radio-volume-val');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            if (volumeVal) volumeVal.textContent = `${val}%`;
            if (window.pipAudio) {
                window.pipAudio.setVolume(val);
            }
        });
    }

    // 4. Gestione HOVER col mouse su tutti gli elementi interattivi -> ui_menu_focus.wav
    const interactiveElements = document.querySelectorAll('button, .nav-btn, .sub-nav-btn, .inv-sub-btn, .special-item, .project-accordion-header, #skip-btn, .radio-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (window.pipAudio) window.pipAudio.playFocus();
        });
    });

    // =========================================
    // 5. PIP-BOY CAT PAW CURSOR & MICRO-ANIMATIONS
    // =========================================
    (function initPipCatCursor() {
        // Disabilitiamo il cursore custom su dispositivi touch puramente mobile
        if (window.matchMedia('(pointer: coarse)').matches) return;

        // Crea il container DOM per la zampina
        const cursorEl = document.createElement('div');
        cursorEl.id = 'pip-cursor';
        cursorEl.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
              <defs>
                <filter id="pip-paw-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g fill="#1bfd02" stroke="#1bfd02" stroke-width="0.8" filter="url(#pip-paw-glow)">
                <!-- Cuscinetto Principale a Cuoricino (Heart-shaped Main Pad) -->
                <path d="M 16,18 C 14.5,14.5 9,14.5 9,19 C 9,23.5 16,27.5 16,27.5 C 16,27.5 23,23.5 23,19 C 23,14.5 17.5,14.5 16,18 Z" />
                <!-- Gommino 1 (Far Left) -->
                <ellipse cx="6.5" cy="14" rx="2.4" ry="3.2" transform="rotate(-25 6.5 14)" />
                <!-- Gommino 2 (Top Left) -->
                <ellipse cx="11.5" cy="8.5" rx="2.5" ry="3.6" transform="rotate(-10 11.5 8.5)" />
                <!-- Gommino 3 (Top Right - Main Hotspot) -->
                <ellipse cx="19.5" cy="8.5" rx="2.5" ry="3.6" transform="rotate(10 19.5 8.5)" />
                <!-- Gommino 4 (Far Right) -->
                <ellipse cx="24.5" cy="14" rx="2.4" ry="3.2" transform="rotate(25 24.5 14)" />
              </g>
            </svg>
        `;
        document.body.appendChild(cursorEl);

        let mouseX = -100, mouseY = -100;
        let isMoving = false;

        function updateCursorPos() {
            cursorEl.style.left = `${mouseX}px`;
            cursorEl.style.top = `${mouseY}px`;
            isMoving = false;
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!cursorEl.classList.contains('active-cursor')) {
                cursorEl.classList.add('active-cursor');
            }
            if (!isMoving) {
                requestAnimationFrame(updateCursorPos);
                isMoving = true;
            }
        });

        document.addEventListener('mouseleave', () => {
            cursorEl.classList.remove('active-cursor');
        });

        document.addEventListener('mouseenter', () => {
            cursorEl.classList.add('active-cursor');
        });

        // Micro-animazione al Click (Squish / Schiacciamento)
        document.addEventListener('mousedown', () => {
            cursorEl.classList.add('squeezed');
        });

        document.addEventListener('mouseup', () => {
            cursorEl.classList.remove('squeezed');
        });

        // Rilevamento Hover su elementi interattivi
        const hoverSelector = 'button, a, input, select, textarea, label, [role="button"], .nav-btn, .sub-nav-btn, .inv-sub-btn, .special-item, .project-accordion-header, #skip-btn, .radio-btn, .interactive';

        document.addEventListener('mouseover', (e) => {
            if (e.target && e.target.closest && e.target.closest(hoverSelector)) {
                cursorEl.classList.add('hovering');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target && e.target.closest && e.target.closest(hoverSelector)) {
                cursorEl.classList.remove('hovering');
            }
        });

        // Gestione Toggle Legal Disclaimer (Footer - Visibile solo in DATA tab)
        document.addEventListener('click', (e) => {
            const btn = e.target && e.target.closest && e.target.closest('#disclaimer-toggle-btn');
            if (btn) {
                const drawer = document.getElementById('disclaimer-drawer');
                if (!drawer) return;
                if (window.pipAudio) window.pipAudio.playSelect();
                const isOpen = drawer.style.display === 'block';
                if (isOpen) {
                    drawer.style.display = 'none';
                    drawer.classList.remove('open');
                    btn.classList.remove('active');
                } else {
                    drawer.style.display = 'block';
                    drawer.classList.add('open');
                    btn.classList.add('active');
                }
            }
        });

        // Micro-interazione: Clic su CTA in DATA fa lampeggiare i link di contatto sopra
        document.addEventListener('click', (e) => {
            const banner = e.target.closest('.data-cta-banner');
            if (banner) {
                if (window.pipAudio) window.pipAudio.playSelect();
                const contactLines = document.querySelectorAll('#data p');
                contactLines.forEach(line => {
                    line.classList.remove('contact-highlight-blink');
                    void line.offsetWidth;
                    line.classList.add('contact-highlight-blink');
                });

                setTimeout(() => {
                    contactLines.forEach(line => line.classList.remove('contact-highlight-blink'));
                }, 1100);
            }
        });
    })();

    // Ripristina la posizione del contenitore destro (stat-right) al ridimensionamento
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            const statRight = document.querySelector('.stat-right');
            const statLayout = document.querySelector('.stat-layout');
            if (statRight && statLayout && statRight.parentNode !== statLayout) {
                statLayout.appendChild(statRight);
            }
        }
    });
});

