// NEO-ONE 3D Fallout Eyebot Vector Engine (Pure CRT Terminal Aesthetic)
(function () {
    let scene, camera, renderer;
    let eyebotGroup, headGroup;
    let pointerX = 0, pointerY = 0;
    let isHovered = false;
    let isTouchActive = false;
    let lastTouchTime = 0;
    let clock = new THREE.Clock();

    // 1. Generate Pure CRT Terminal Vector Texture for Fallout Eyebot Front Visor Lens
    function createEyebotVectorTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Dark CRT terminal background
        ctx.fillStyle = '#040d02';
        ctx.fillRect(0, 0, 512, 512);

        const cx = 256, cy = 256;

        ctx.strokeStyle = '#1bfd02';
        ctx.fillStyle = '#1bfd02';
        ctx.shadowColor = '#1bfd02';
        ctx.shadowBlur = 10;

        // A. Eyebot Main Head Outline
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, cy, 220, 0, Math.PI * 2);
        ctx.stroke();

        // B. Iconic Eyebot Front Speaker Grill / Visor Frame
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 140, 110, 0, 0, Math.PI * 2);
        ctx.stroke();

        // C. Horizontal Visor Slits (Eyebot Grille)
        ctx.lineWidth = 4;
        for (let y = -80; y <= 80; y += 22) {
            const hw = Math.sqrt(Math.max(0, 140 * 140 * (1 - (y * y) / (110 * 110))));
            ctx.beginPath();
            ctx.moveTo(cx - hw + 8, cy + y);
            ctx.lineTo(cx + hw - 8, cy + y);
            ctx.stroke();
        }

        // D. Glowing Central Eye Lens Pupil (Laser Sensor)
        ctx.beginPath();
        ctx.arc(cx, cy, 38, 0, Math.PI * 2);
        ctx.fill();

        // E. Central Pupil Inner Glint
        ctx.fillStyle = '#040d02';
        ctx.beginPath();
        ctx.arc(cx - 10, cy - 10, 12, 0, Math.PI * 2);
        ctx.fill();

        // F. Eyebot Rivets & Side Bolt Lines
        ctx.strokeStyle = '#1bfd02';
        ctx.lineWidth = 3;
        const rivetAngles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4];
        rivetAngles.forEach(angle => {
            const rx = cx + Math.cos(angle) * 195;
            const ry = cy + Math.sin(angle) * 195;
            ctx.beginPath();
            ctx.arc(rx, ry, 5, 0, Math.PI * 2);
            ctx.stroke();
        });

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

        // 1. Scene & Camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 5.2;

        // 2. Renderer
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // 3. Lights
        const ambientLight = new THREE.AmbientLight(0x1bfd02, 1.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x1bfd02, 2.2);
        pointLight.position.set(0, 0, 5);
        scene.add(pointLight);

        // 4. 3D Eyebot Main Group
        eyebotGroup = new THREE.Group();
        scene.add(eyebotGroup);

        headGroup = new THREE.Group();
        eyebotGroup.add(headGroup);

        // 5. Eyebot Sphere Head with Visor Texture
        const eyebotTexture = createEyebotVectorTexture();
        const geometry = new THREE.SphereGeometry(1.4, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            map: eyebotTexture,
            roughness: 0.2,
            metalness: 0.1,
            emissive: new THREE.Color(0x1bfd02),
            emissiveIntensity: 0.35
        });

        const headMesh = new THREE.Mesh(geometry, material);
        headGroup.add(headMesh);

        // 6. Outer Wireframe Armor Cage
        const wireGeo = new THREE.SphereGeometry(1.46, 20, 20);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x1bfd02,
            wireframe: true,
            transparent: true,
            opacity: 0.12
        });
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);
        headGroup.add(wireMesh);

        // 7. 3D FALLOUT EYEBOT ANTENNA ARRAY (Le Antenne Tipiche dell'Eyebot)
        const lineMat = new THREE.LineBasicMaterial({ color: 0x1bfd02, linewidth: 2 });

        // A. Main Top Radio Antenna Spire
        const topAntennaGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 1.4, 0),
            new THREE.Vector3(0, 2.5, 0)
        ]);
        const topAntenna = new THREE.Line(topAntennaGeo, lineMat);
        headGroup.add(topAntenna);

        // Top Antenna Crossbars
        [1.7, 2.0, 2.3].forEach(yPos => {
            const barGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-0.25, yPos, 0),
                new THREE.Vector3(0.25, yPos, 0)
            ]);
            const bar = new THREE.Line(barGeo, lineMat);
            headGroup.add(bar);
        });

        // B. Side Sensor Antennas (Trailing Prongs)
        const sideAngles = [
            { x: 1.2, y: 0.5, z: -0.4, dx: 2.1, dy: 0.9, dz: -1.2 },
            { x: -1.2, y: 0.5, z: -0.4, dx: -2.1, dy: 0.9, dz: -1.2 },
            { x: 1.2, y: -0.5, z: -0.4, dx: 2.1, dy: -0.9, dz: -1.2 },
            { x: -1.2, y: -0.5, z: -0.4, dx: -2.1, dy: -0.9, dz: -1.2 }
        ];

        sideAngles.forEach(p => {
            const antGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(p.x, p.y, p.z),
                new THREE.Vector3(p.dx, p.dy, p.dz)
            ]);
            const antLine = new THREE.Line(antGeo, lineMat);
            headGroup.add(antLine);
        });

        animate();

        // 8. Event Handlers (Mouse & Touch Tracking)
        function updatePointer(clientX, clientY) {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            pointerX = (clientX - centerX) / (window.innerWidth / 2);
            pointerY = (clientY - centerY) / (window.innerHeight / 2);

            pointerX = Math.max(-1.0, Math.min(1.0, pointerX));
            pointerY = Math.max(-1.0, Math.min(1.0, pointerY));
        }

        window.addEventListener('mousemove', function (e) {
            updatePointer(e.clientX, e.clientY);
        }, { passive: true });

        window.addEventListener('click', function (e) {
            updatePointer(e.clientX, e.clientY);
            if (window.pipAudio) window.pipAudio.playSelect();
            triggerPulse();
        }, { passive: true });

        window.addEventListener('touchstart', function (e) {
            if (e.touches && e.touches[0]) {
                isTouchActive = true;
                lastTouchTime = clock.getElapsedTime();
                updatePointer(e.touches[0].clientX, e.touches[0].clientY);
                triggerPulse();
            }
        }, { passive: true });

        window.addEventListener('touchmove', function (e) {
            if (e.touches && e.touches[0]) {
                isTouchActive = true;
                lastTouchTime = clock.getElapsedTime();
                updatePointer(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchend', function () {
            isTouchActive = false;
        }, { passive: true });

        container.addEventListener('mouseenter', function () {
            isHovered = true;
            if (window.pipAudio) window.pipAudio.playFocus();
        });

        container.addEventListener('mouseleave', function () {
            isHovered = false;
        });

        window.addEventListener('resize', function () {
            if (!container || !renderer || !camera) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }

    let pulseTime = 0;
    function triggerPulse() {
        pulseTime = 1.0;
    }

    // 9. ANIMATION LOOP: Eyebot Floating + Pointer Tracking
    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        if (eyebotGroup && headGroup) {
            // A. Pointer Lerp Tracking (Rotation Offset for Front Visor facing user)
            const rotationOffset = -Math.PI / 2;
            const targetRotY = (pointerX * Math.PI) / 4 + rotationOffset;
            const targetRotX = (pointerY * Math.PI) / 4;

            eyebotGroup.rotation.y = THREE.MathUtils.lerp(eyebotGroup.rotation.y, targetRotY, 0.14);
            eyebotGroup.rotation.x = THREE.MathUtils.lerp(eyebotGroup.rotation.x, targetRotX, 0.14);
            eyebotGroup.rotation.z = THREE.MathUtils.lerp(eyebotGroup.rotation.z, 0, 0.16);

            // B. Eyebot Classic Floating Movement (Galleggiamento Robotico)
            eyebotGroup.position.y = Math.sin(time * 1.8) * 0.08;
            headGroup.rotation.z = Math.sin(time * 1.2) * 0.04;

            // C. Hover & Click Scale Pulse
            let targetScale = 1.0;
            if (isHovered || isTouchActive || (time - lastTouchTime <= 1.5)) targetScale = 1.15;
            if (pulseTime > 0) {
                targetScale += Math.sin(pulseTime * Math.PI) * 0.25;
                pulseTime -= delta * 3;
            }

            const currentScale = eyebotGroup.scale.x;
            const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.15);
            eyebotGroup.scale.setScalar(nextScale);
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
