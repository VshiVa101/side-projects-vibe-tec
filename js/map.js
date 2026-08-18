/* =========================================
   VIBE-TEC PIP-BOY WORLD MAP (LEAFLET ENGINE)
   Targeting: Italy / Bologna HQ
   Icon: Vault-Tec Van (vaulttecvan.webp)
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const mapTabBtn = document.querySelector('.nav-btn[data-target="map"]');
    const leafletMapContainer = document.getElementById('leaflet-pip-map');
    let pipMap = null;
    let bolognaMarker = null;
    let leafletMarkers = {}; // Store markers to open them programmatically

    // Bologna Coordinates
    const BOLOGNA_COORDS = [44.4949, 11.3426];
    const DEFAULT_ZOOM = 7;

    // Wasteland points of interest in Italy (completely in English)
    const WASTELAND_LOCATIONS = [
        {
            key: "rome",
            name: "CAPITAL SECTOR - ROME",
            coords: [41.9028, 12.4964],
            desc: "> PRIMARY WASTELAND CAPITAL HUB<br>> RADAR STATUS: SECURE CHANNELS ACTIVE"
        },
        {
            key: "milan",
            name: "DESIGN OUTPOST - MILAN",
            coords: [45.4642, 9.1900],
            desc: "> R&D LABS & SYSTEM ARCHITECTURE<br>> RADAR STATUS: LOCAL GRID STABLE"
        },
        {
            key: "florence",
            name: "HISTORICAL ARCHIVE - FLORENCE",
            coords: [43.7696, 11.2558],
            desc: "> LEGACY ART & UX ARCHIVE SECTOR<br>> RADAR STATUS: CORE NETWORKS SYNCED"
        },
        {
            key: "venice",
            name: "AQUATIC RADAR - VENICE",
            coords: [45.4371, 12.3326],
            desc: "> LAGOON OUTPOST & NAVIGATION<br>> RADAR STATUS: SEA LANES ONLINE"
        },
        {
            key: "turin",
            name: "ALPINE STATION - TURIN",
            coords: [45.0703, 7.6869],
            desc: "> BORDER PATROL WATCHTOWER<br>> RADAR STATUS: SCANNING MOUNTAIN PASS"
        },
        {
            key: "naples",
            name: "SOUTHERN PORT - NAPLES",
            coords: [40.8518, 14.2681],
            desc: "> PORT DEPOT & SUPPLY STATION<br>> RADAR STATUS: SECTOR SECURED"
        }
    ];

    function initPipMap() {
        if (pipMap || !leafletMapContainer || typeof L === 'undefined') return;

        try {
            // Create Leaflet Map instance inside #leaflet-pip-map
            pipMap = L.map('leaflet-pip-map', {
                center: BOLOGNA_COORDS,
                zoom: DEFAULT_ZOOM,
                zoomControl: false,
                attributionControl: false
            });

            // CartoDB Dark Matter tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 18,
                minZoom: 5,
                subdomains: 'abcd'
            }).addTo(pipMap);

            // Custom Vault-Tec Van Icon for Bologna
            const vanIcon = L.divIcon({
                className: 'pip-van-icon-wrapper',
                html: `
                    <div class="pip-marker-pulse"></div>
                    <div class="pip-marker-van-box">
                        <img src="assets/img/vaulttecvan.webp" class="pip-van-img" alt="Vault-Tec Van HQ">
                        <div class="pip-marker-label">BOLOGNA HQ</div>
                    </div>
                `,
                iconSize: [60, 60],
                iconAnchor: [30, 30],
                popupAnchor: [0, -32]
            });

            bolognaMarker = L.marker(BOLOGNA_COORDS, { icon: vanIcon }).addTo(pipMap);

            const bolognaPopupHtml = `
                <div class="pip-popup-card">
                    <div class="pip-popup-header">
                        <img src="assets/img/vaulttecvan.webp" class="pip-popup-van-thumb" alt="Vault-Tec Van">
                        <div class="pip-popup-header-text">
                            <span class="pip-popup-title">BOLOGNA HQ</span>
                            <span class="pip-popup-coords">44.4949° N, 11.3426° E</span>
                        </div>
                    </div>
                    <div class="pip-popup-divider"></div>
                    <div class="pip-popup-body">
                        <p class="pip-popup-row"><span class="pip-label">> OPERATOR:</span> <span class="pip-val">LEONARDO SORRENTINO</span></p>
                        <p class="pip-popup-row"><span class="pip-label">> ROLE:</span> <span class="pip-val">UX DESIGNER JUNIOR & STRATEGIST</span></p>
                        <p class="pip-popup-row"><span class="pip-label">> VEHICLE:</span> <span class="pip-val">VRIHAT-VIBE-TEC</span></p>
                        <p class="pip-popup-row"><span class="pip-label">> RADAR STATUS:</span> <span class="pip-val-active">100% ONLINE [FAST TRAVEL OK]</span></p>
                    </div>
                </div>
            `;

            bolognaMarker.bindPopup(bolognaPopupHtml, {
                className: 'pip-boy-custom-popup',
                maxWidth: 260,
                minWidth: 180,
                autoPan: true,
                autoPanPadding: [20, 20]
            });

            bolognaMarker.on('click', () => {
                if (window.pipAudio) window.pipAudio.playSelect();
            });

            // Add other locations to Leaflet map
            WASTELAND_LOCATIONS.forEach(loc => {
                const outpostIcon = L.divIcon({
                    className: 'pip-outpost-icon-wrapper',
                    html: `
                        <div class="pip-outpost-dot"></div>
                        <div class="pip-outpost-label">${loc.key.toUpperCase()}</div>
                    `,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                    popupAnchor: [0, -12]
                });

                const marker = L.marker(loc.coords, { icon: outpostIcon }).addTo(pipMap);
                
                marker.bindPopup(`
                    <div class="pip-popup-card">
                        <h4 class="pip-popup-title">${loc.name}</h4>
                        <div class="pip-popup-divider"></div>
                        <p class="pip-popup-body">${loc.desc}</p>
                    </div>
                `, {
                    className: 'pip-boy-custom-popup',
                    maxWidth: 220,
                    minWidth: 150,
                    autoPan: true,
                    autoPanPadding: [20, 20]
                });

                marker.on('click', () => {
                    if (window.pipAudio) window.pipAudio.playHighlight();
                });

                // Cache reference
                leafletMarkers[loc.key] = marker;
            });

        } catch (e) {
            console.log("Leaflet map initialization error:", e);
        }
    }

    // Map HUD Controls
    const recenterBtn = document.getElementById('map-recenter-btn');
    const zoomInBtn = document.getElementById('map-zoom-in-btn');
    const zoomOutBtn = document.getElementById('map-zoom-out-btn');

    if (recenterBtn) {
        recenterBtn.addEventListener('click', () => {
            if (window.pipAudio) window.pipAudio.playSelect();
            if (pipMap) {
                pipMap.flyTo(BOLOGNA_COORDS, DEFAULT_ZOOM, { duration: 1.2 });
            }
        });
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (window.pipAudio) window.pipAudio.playSelect();
            if (pipMap) pipMap.zoomIn();
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (window.pipAudio) window.pipAudio.playSelect();
            if (pipMap) pipMap.zoomOut();
        });
    }

    if (mapTabBtn) {
        mapTabBtn.addEventListener('click', () => {
            setTimeout(() => {
                if (!pipMap) {
                    initPipMap();
                } else {
                    pipMap.invalidateSize();
                }
            }, 150);
        });
    }

    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab && activeTab.id === 'map') {
        setTimeout(initPipMap, 200);
    }
});
