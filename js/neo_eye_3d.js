// NEO-ONE 3D Eye Engine - 1950s Atomic Sci-Fi Eyeball
// Features: Perfectly Centered Iris/Pupil Cursor & Touch Tracking, 3 Atomic Orbit Rings with Revolving Neutrons, 3 Dynamic Animations

(function () {
    let scene, camera, renderer;
    let eyeGroup, animationGroup, eyeMesh;
    let orbitRing1, orbitRing2, orbitRing3;
    let neutron1, neutron2, neutron3;

    let pointerState = {
        x: 0,
        y: 0,
        inputType: null,
        lastTouchAt: -999,
        isTouchActive: false
    };
    let ignoreSyntheticMouseUntil = 0;
    let isHovered = false;
    let pulseScale = 1.0;
    let clock = new THREE.Clock();

    // 1. Procedural 1950s Sclera Texture Generator (White/Pale Green with Blood Capillaries)
    function generateScleraTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        const cx = 512, cy = 512;

        // Base Sclera Gradient
        const scleraGrad = ctx.createRadialGradient(cx, cy, 100, cx, cy, 512);
        scleraGrad.addColorStop(0, '#f8fff8');
        scleraGrad.addColorStop(0.5, '#d4f4d4');
        scleraGrad.addColorStop(0.85, '#82b882');
        scleraGrad.addColorStop(1, '#3b663b');
        ctx.fillStyle = scleraGrad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Branching Red & Glowing Green Blood Veins
        const drawVein = (startX, startY, angle, length, depth, color) => {
            if (depth <= 0) return;
            ctx.strokeStyle = color;
            ctx.lineWidth = depth * 1.8;
            ctx.beginPath();
            ctx.moveTo(startX, startY);

            const endX = startX + Math.cos(angle) * length;
            const endY = startY + Math.sin(angle) * length;
            const ctrlX = (startX + endX) / 2 + (Math.random() - 0.5) * 45;
            const ctrlY = (startY + endY) / 2 + (Math.random() - 0.5) * 45;

            ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
            ctx.stroke();

            if (depth > 1) {
                drawVein(endX, endY, angle + (Math.random() - 0.5) * 0.75, length * 0.65, depth - 1, color);
                if (Math.random() > 0.35) {
                    drawVein(endX, endY, angle + (Math.random() - 0.5) * 0.75, length * 0.55, depth - 1, color);
                }
            }
        };

        const veinCount = 24;
        for (let i = 0; i < veinCount; i++) {
            const angle = (i / veinCount) * Math.PI * 2;
            const startX = cx + Math.cos(angle) * 490;
            const startY = cy + Math.sin(angle) * 490;
            const color = (i % 2 === 0) ? 'rgba(230, 25, 25, 0.8)' : 'rgba(27, 253, 2, 0.7)';
            drawVein(startX, startY, angle + Math.PI, 140 + Math.random() * 80, 3, color);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }

    // 2. Procedural 1950s Iris & Pupil Canvas (Centered 100% on Front Face)
    function generateIrisTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const cx = 256, cy = 256;

        // Outer Dark Iris Ring
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#021802';
        ctx.beginPath();
        ctx.arc(cx, cy, 240, 0, Math.PI * 2);
        ctx.stroke();

        // Radial Glowing Emerald/Hazel Iris Fill
        const irisGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, 240);
        irisGrad.addColorStop(0, '#88ff88');
        irisGrad.addColorStop(0.35, '#1bfd02');
        irisGrad.addColorStop(0.75, '#0b770b');
        irisGrad.addColorStop(1, '#022202');
        ctx.fillStyle = irisGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 240, 0, Math.PI * 2);
        ctx.fill();

        // Iris Fiber Strands
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 36) {
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * 80, cy + Math.sin(a) * 80);
            ctx.lineTo(cx + Math.cos(a) * 230, cy + Math.sin(a) * 230);
            ctx.stroke();
        }

        // Deep Glossy Black Pupil
        ctx.fillStyle = '#010501';
        ctx.beginPath();
        ctx.arc(cx, cy, 85, 0, Math.PI * 2);
        ctx.fill();

        // 1950s Specular Glossy Glint Highlights (Classic Comic Glare)
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        // Primary Glint Dot
        ctx.beginPath();
        ctx.arc(cx - 36, cy - 36, 26, 0, Math.PI * 2);
        ctx.fill();
        // Secondary Glint Dot
        ctx.beginPath();
        ctx.arc(cx - 62, cy - 12, 10, 0, Math.PI * 2);
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }

    function initNeoEye() {
        const container = document.getElementById('neo-eye-canvas-container');
        if (!container) return;

        container.innerHTML = '';
        const width = container.clientWidth || 220;
        const height = container.clientHeight || 220;

        // 1. Scene & Camera Setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 5.2;

        // 2. WebGL Renderer
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // 3. Lighting Setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        scene.add(ambientLight);

        const mainDirLight = new THREE.DirectionalLight(0xffffff, 1.6);
        mainDirLight.position.set(-3, 3, 4);
        scene.add(mainDirLight);

        const acidGreenLight = new THREE.PointLight(0x1bfd02, 4.0, 15);
        acidGreenLight.position.set(0, -4, 2);
        scene.add(acidGreenLight);

        // 4. Dual-Group Hierarchy for Separated Cursor Tracking & Internal Motions
        eyeGroup = new THREE.Group();
        scene.add(eyeGroup);

        animationGroup = new THREE.Group();
        eyeGroup.add(animationGroup);

        // 5. Construct 3D Eyeball Mesh & Front-Facing Centered Iris Lens
        const scleraTexture = generateScleraTexture();
        const eyeGeo = new THREE.SphereGeometry(1.35, 64, 64);
        const eyeMat = new THREE.MeshStandardMaterial({
            map: scleraTexture,
            roughness: 0.22,
            metalness: 0.08,
            emissive: new THREE.Color(0x041804),
            emissiveIntensity: 0.2
        });

        eyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
        animationGroup.add(eyeMesh);

        // Centered Iris Lens directly on the Front (+Z) at Z = 1.352 facing Camera
        const irisTexture = generateIrisTexture();
        const irisGeo = new THREE.CircleGeometry(0.72, 64);
        const irisMat = new THREE.MeshBasicMaterial({
            map: irisTexture,
            transparent: true,
            side: THREE.FrontSide
        });
        const irisMesh = new THREE.Mesh(irisGeo, irisMat);
        irisMesh.position.set(0, 0, 1.352); // Exactly centered on front face!
        animationGroup.add(irisMesh);

        // 6. Build 3 Retro 1950s Atomic Orbit Rings with Revolving Neutrons
        const ringGeo = new THREE.TorusGeometry(1.78, 0.014, 16, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x1bfd02,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });

        const neutronGeo = new THREE.SphereGeometry(0.065, 16, 16);
        const neutronMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

        // Atomic Ring 1
        orbitRing1 = new THREE.Group();
        orbitRing1.rotation.set(Math.PI / 4, 0, 0);
        const rMesh1 = new THREE.Mesh(ringGeo, ringMat);
        orbitRing1.add(rMesh1);
        neutron1 = new THREE.Mesh(neutronGeo, neutronMat);
        orbitRing1.add(neutron1);
        animationGroup.add(orbitRing1);

        // Atomic Ring 2
        orbitRing2 = new THREE.Group();
        orbitRing2.rotation.set(-Math.PI / 4, Math.PI / 3, 0);
        const rMesh2 = new THREE.Mesh(ringGeo, ringMat);
        orbitRing2.add(rMesh2);
        neutron2 = new THREE.Mesh(neutronGeo, neutronMat);
        orbitRing2.add(neutron2);
        animationGroup.add(orbitRing2);

        // Atomic Ring 3
        orbitRing3 = new THREE.Group();
        orbitRing3.rotation.set(Math.PI / 6, -Math.PI / 3, Math.PI / 4);
        const rMesh3 = new THREE.Mesh(ringGeo, ringMat);
        orbitRing3.add(rMesh3);
        neutron3 = new THREE.Mesh(neutronGeo, neutronMat);
        orbitRing3.add(neutron3);
        animationGroup.add(orbitRing3);

        // Outer Glow Atmospheric Shell
        const glowGeo = new THREE.SphereGeometry(1.39, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x1bfd02,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide
        });
        animationGroup.add(new THREE.Mesh(glowGeo, glowMat));

        // 7. Global Cursor & Mobile Touch Tracking Handlers
        function updatePointerFromPoint(clientX, clientY, inputType) {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
            pointerState.x = clamp((clientX - centerX) / (window.innerWidth / 2), -1.2, 1.2);
            pointerState.y = clamp(-(clientY - centerY) / (window.innerHeight / 2), -1.2, 1.2);
            pointerState.inputType = inputType;

            const now = performance.now() / 1000;
            if (inputType === 'touch') {
                pointerState.lastTouchAt = now;
                pointerState.isTouchActive = true;
                ignoreSyntheticMouseUntil = performance.now() + 1600;
            } else {
                pointerState.isTouchActive = false;
            }
        }

        const handleMouseMove = (e) => {
            if (performance.now() < ignoreSyntheticMouseUntil) return;
            updatePointerFromPoint(e.clientX, e.clientY, 'mouse');
        };

        const handleTouchMove = (e) => {
            const touch = e.touches[0] || (e.changedTouches && e.changedTouches[0]);
            if (touch) updatePointerFromPoint(touch.clientX, touch.clientY, 'touch');
        };

        const handleTouchEnd = (e) => {
            const touch = e.changedTouches && e.changedTouches[0];
            if (touch) updatePointerFromPoint(touch.clientX, touch.clientY, 'touch');
            pointerState.isTouchActive = false;
            pointerState.lastTouchAt = performance.now() / 1000;
            ignoreSyntheticMouseUntil = performance.now() + 1600;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('touchstart', handleTouchMove, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

        container.addEventListener('mouseenter', () => {
            isHovered = true;
            if (window.pipAudio) window.pipAudio.playFocus();
        });

        container.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        container.addEventListener('click', (e) => {
            updatePointerFromPoint(e.clientX, e.clientY, 'mouse');
            pulseScale = 1.35;
            if (window.pipAudio) window.pipAudio.playSelect();
        });

        window.addEventListener('resize', () => {
            if (!container || !renderer || !camera) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });

        animate();
    }

    // 8. Render Loop: Centered Pointer Tracking + 3 Atomic Revolving Neutrons + 3 Motions
    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();
        const now = performance.now() / 1000;

        if (eyeGroup && animationGroup) {
            // --- 1. TRACKING: Pupil Perfectly Centered & Locked to Cursor/Touch ---
            const idleX = Math.sin(time * 0.7) * 0.35;
            const idleY = Math.cos(time * 0.9) * 0.2;

            const hasMousePointer = pointerState.inputType === 'mouse';
            const hasFreshTouchPointer = pointerState.inputType === 'touch' &&
                (pointerState.isTouchActive || (now - pointerState.lastTouchAt <= 1.2));
            const usePointer = hasMousePointer || hasFreshTouchPointer;

            // Centered Rotation Angles (Zero Offset)
            const targetRotY = usePointer ? pointerState.x * (Math.PI / 4.5) : idleX;
            const targetRotX = usePointer ? -pointerState.y * (Math.PI / 4.5) : idleY;

            eyeGroup.rotation.y = THREE.MathUtils.lerp(eyeGroup.rotation.y, targetRotY, 0.14);
            eyeGroup.rotation.x = THREE.MathUtils.lerp(eyeGroup.rotation.x, targetRotX, 0.14);

            // --- 2. REVOLVING ATOMIC NEUTRONS ---
            const r = 1.78;
            if (neutron1) neutron1.position.set(r * Math.cos(time * 2.2), r * Math.sin(time * 2.2), 0);
            if (neutron2) neutron2.position.set(r * Math.cos(-time * 2.8 + 1.2), r * Math.sin(-time * 2.8 + 1.2), 0);
            if (neutron3) neutron3.position.set(r * Math.cos(time * 3.4 + 2.5), r * Math.sin(time * 3.4 + 2.5), 0);

            // Slowly spin the orbit rings
            if (orbitRing1) orbitRing1.rotation.z = time * 0.2;
            if (orbitRing2) orbitRing2.rotation.z = -time * 0.3;
            if (orbitRing3) orbitRing3.rotation.z = time * 0.25;

            // --- 3. DYNAMIC ANIMATIONS (Flip X, Roll Z, High-Freq Vibration) ---
            
            // Animation 1: Capovolgimento Lento Periodico (Vertical Flip)
            const flipInterval = 9;
            const flipDuration = 1.2;
            const flipTime = time % flipInterval;
            const flipX = flipTime < flipDuration
                ? ((1 - Math.cos((flipTime / flipDuration) * Math.PI)) / 2) * Math.PI * 2
                : 0;

            // Animation 2: Rotolo Veloce sull'Asse Pupilla (Roll Z)
            const rollInterval = 13;
            const rollDuration = 1.5;
            const rollTime = time % rollInterval;
            const rollZ = rollTime < rollDuration
                ? ((1 - Math.cos((rollTime / rollDuration) * Math.PI)) / 2) * Math.PI * 2
                : 0;

            // Animation 3: Vibrazione / Scossa ad Alta Frequenza (Shake)
            const vibrationInterval = 5;
            const vibrationDuration = 0.15;
            const isVibrating = (time % vibrationInterval) < vibrationDuration;
            const vibrationFrequency = 100;
            const vibrationAmplitude = 0.12;
            const vibrationX = isVibrating ? Math.sin(time * vibrationFrequency) * vibrationAmplitude : 0;
            const vibrationY = isVibrating ? Math.cos(time * vibrationFrequency) * vibrationAmplitude : 0;

            animationGroup.rotation.x = -flipX + vibrationY;
            animationGroup.rotation.y = vibrationX;
            animationGroup.rotation.z = rollZ;

            // --- 4. Scale & Hover Expansion ---
            let targetScale = 1.0;
            if (isHovered || pointerState.isTouchActive || (now - pointerState.lastTouchAt <= 1.2)) {
                targetScale = 1.25;
            }

            if (pulseScale > 1.0) {
                targetScale *= pulseScale;
                pulseScale = THREE.MathUtils.lerp(pulseScale, 1.0, delta * 4);
            }

            const currentScale = eyeGroup.scale.x;
            const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.14);
            eyeGroup.scale.setScalar(nextScale);
        }

        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(initNeoEye, 200);
    });

    window.initNeoEye = initNeoEye;
})();
