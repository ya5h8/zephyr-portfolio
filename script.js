// ── GSAP REGISTER ──
gsap.registerPlugin(ScrollTrigger);

// ── LOADER ──
(function () {
    const loader = document.getElementById('loader');
    const startBtn = document.getElementById('ld-start');
    const barFill = document.getElementById('ld-bar-fill');
    const barWrap = document.getElementById('ld-bar-wrap');
    const pct = document.getElementById('ld-pct');

    if (!startBtn) return;

    startBtn.addEventListener('click', () => {
        // hide button, show bar
        gsap.to(startBtn, {
            opacity: 0, y: -10, duration: .35, ease: 'power2.in',
            onComplete() { startBtn.style.display = 'none'; }
        });
        setTimeout(() => {
            if (barWrap) barWrap.style.opacity = '1';
            if (pct) pct.style.opacity = '1';
        }, 300);

        // progress 0→100
        let n = 0;
        const iv = setInterval(() => {
            n += Math.floor(Math.random() * 7) + 3;
            if (n >= 100) n = 100;
            if (barFill) barFill.style.width = n + '%';
            if (pct) pct.textContent = String(n).padStart(2, '0') + '%';
            if (n >= 100) {
                clearInterval(iv);
                setTimeout(() => {
                    gsap.to(loader, {
                        yPercent: -100, duration: 1, ease: 'power4.inOut',
                        onComplete() {
                            loader.style.display = 'none';
                            heroIn();
                        }
                    });
                }, 350);
            }
        }, 25);
    });
})();

// ── CURSOR ──
const dot = document.getElementById('dot');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY });
(function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (dot) {
        dot.style.left = rx + 'px';
        dot.style.top = ry + 'px';
    }
    requestAnimationFrame(loop);
})();
document.querySelectorAll('a, button, .pj, .a-st, .pill, .soc, .edu-card, .ach-item').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('big'));
    el.addEventListener('mouseleave', () => dot.classList.remove('big'));
});

// ── NAV + PROGRESS ──
window.addEventListener('scroll', () => {
    const p = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    const prog = document.getElementById('prog');
    const nav = document.getElementById('nav');
    if (prog) prog.style.width = p + '%';
    if (prog) prog.style.width = p + '%';
}, { passive: true });

// ── THREE.JS HERO (Acid Theme) ──
(function () {
    const canvas = document.getElementById('threeC');
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, .1, 200);
    cam.position.z = 7;

    // Dot field
    const count = 3000;
    const pp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pp[i * 3] = (Math.random() - .5) * 35;
        pp[i * 3 + 1] = (Math.random() - .5) * 25;
        pp[i * 3 + 2] = (Math.random() - .5) * 15;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3));
    scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x6b6a72, size: .015, transparent: true, opacity: .2 })));

    // Geometry accents
    const octMat = new THREE.MeshBasicMaterial({ color: 0xc8f53e, wireframe: true, transparent: true, opacity: .05 });
    const oct = new THREE.Mesh(new THREE.OctahedronGeometry(2.5, 0), octMat);
    oct.position.set(5, .5, -1); scene.add(oct);

    const boxMat = new THREE.MeshBasicMaterial({ color: 0xf0ede8, wireframe: true, transparent: true, opacity: .04 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3, 1.5), boxMat);
    box.position.set(2, 1, -2); scene.add(box);

    const tetMat = new THREE.MeshBasicMaterial({ color: 0xc8f53e, wireframe: true, transparent: true, opacity: .08 });
    const tet = new THREE.Mesh(new THREE.TetrahedronGeometry(1.4, 0), tetMat);
    tet.position.set(-6, -1, -2); scene.add(tet);

    let mouse = { x: 0, y: 0 };
    document.addEventListener('mousemove', e => {
        mouse.x = (e.clientX / window.innerWidth - .5) * .5;
        mouse.y = (e.clientY / window.innerHeight - .5) * .4;
    }, { passive: true });

    const clk = new THREE.Clock();
    (function animate() {
        requestAnimationFrame(animate);
        const t = clk.getElapsedTime();
        oct.rotation.y = t * .12; oct.rotation.x = t * .06;
        box.rotation.y = t * .18; box.rotation.z = t * .08;
        tet.rotation.y = t * .2; tet.rotation.x = t * .12;
        cam.position.x += (mouse.x - cam.position.x) * .04;
        cam.position.y += (-mouse.y - cam.position.y) * .04;
        cam.lookAt(0, 0, 0);
        renderer.render(scene, cam);
    })();

    window.addEventListener('resize', () => {
        cam.aspect = window.innerWidth / window.innerHeight; cam.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();

// ── GEO CANVAS ──
(function () {
    const el = document.getElementById('geo-canvas'); if (!el) return;
    const ctx = el.getContext('2d');
    let t = 0;

    function resize() {
        const W = el.offsetWidth; el.width = W; el.height = W;
    }
    window.addEventListener('resize', resize);
    resize();

    function draw() {
        const W = el.width, H = el.height;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0e0e14'; ctx.fillRect(0, 0, W, H);

        // Grid dots
        const sp = 45; ctx.fillStyle = 'rgba(200, 245, 62, 0.15)';
        for (let x = sp; x < W; x += sp) for (let y = sp; y < H; y += sp) {
            ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
        }

        // Accents
        const cx = W * .5, cy = H * .5, sz = W * .25;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * .2);
        ctx.strokeStyle = 'rgba(200, 245, 62, 0.4)'; ctx.lineWidth = 1.5; ctx.strokeRect(-sz / 2, -sz / 2, sz, sz);
        ctx.rotate(Math.PI * .25);
        ctx.strokeStyle = 'rgba(240, 237, 232, 0.2)'; ctx.lineWidth = 1; ctx.strokeRect(-sz * .7 / 2, -sz * .7 / 2, sz * .7, sz * .7);
        ctx.restore();

        // Floating lines
        ctx.strokeStyle = 'rgba(200, 245, 62, 0.08)'; ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            ctx.beginPath(); ctx.moveTo(W * .6 + i * 20, 0); ctx.lineTo(W, H * .2 + i * 15); ctx.stroke();
        }

        t += .008; requestAnimationFrame(draw);
    }
    draw();
})();

// ── HERO IN ──
function heroIn() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to('.h-eyebrow', { opacity: 1, y: 0, duration: .8 }, 0)
        .to('.h-inner .mask-inner', { y: '0%', duration: 1.2, stagger: .12 }, .15)
        .to('.h-role', { opacity: 1, y: 0, duration: .8 }, .7)
        .to('.h-btns', { opacity: 1, y: 0, duration: .8 }, .85)
        .to('.h-corner', { opacity: 1, duration: .7 }, 1)
        .to('.scroll-hint', { opacity: 1, duration: .7 }, 1.1);
}

// ── SCROLL ANIMATIONS ──
// Section masks
gsap.utils.toArray('.s-title').forEach(el => {
    const words = el.querySelectorAll('.mask-inner');
    if (words.length) {
        gsap.fromTo(words, { y: '105%' }, {
            y: '0%', duration: 1, ease: 'power4.out', stagger: .1,
            scrollTrigger: { trigger: el, start: 'top 88%' }
        });
    }
});

// Section labels
gsap.utils.toArray('.s-label').forEach(el => {
    gsap.fromTo(el, { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: .8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' }
    });
});

// Generic reveal
gsap.utils.toArray('[data-scroll-reveal]').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' }
    });
});

// Sticker Float
gsap.to('.msg-box', {
    y: 15, duration: 2.5, ease: 'sine.inOut', repeat: -1, yoyo: true
});
gsap.to('.msg-box', {
    rotate: -1, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true
});

// Exp rows
gsap.utils.toArray('.exp-row').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, x: -50 }, {
        opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        delay: i * 0.12
    });
});

// Ach/Projects
gsap.utils.toArray('.ach-item, .pj').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        delay: i * 0.08
    });
});


gsap.to('#hst', {
    x: '-33.33%',
    ease: 'none',
    scrollTrigger: {
        trigger: '.h-scroll-wrap',
        start: 'top bottom',
        end: 'bottom top+=500%',
        scrub: 5
    }
});


// ── TYPING ──
(function () {
    const el = document.getElementById('typed-out'); if (!el) return;
    const lines = [
        "Stay bold & have a nice day.",
        "Building intelligent systems.",
        "Open to new collaborations.",
        "AI + Code + Passion.",
        "Let's create something unique."
    ];
    let pi = 0, ci = 0, removing = false;
    function tick() {
        const s = lines[pi];
        if (!removing && ci <= s.length) {
            el.innerHTML = s.slice(0, ci) + '<span class="caret"></span>';
            ci++;
            setTimeout(tick, 70 + Math.random() * 30);
        } else if (!removing) {
            removing = true;
            setTimeout(tick, 2200);
        } else if (ci > 0) {
            el.innerHTML = s.slice(0, ci) + '<span class="caret"></span>';
            ci--;
            setTimeout(tick, 30);
        } else {
            removing = false;
            pi = (pi + 1) % lines.length;
            ci = 0;
            setTimeout(tick, 400);
        }
    }
    tick();
})();
