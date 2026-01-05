/* background-canvas.js */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let mouse = { x: -1000, y: -1000 };
    let isMouseDown = false;
    let growingStar = null;
    
    // Detect mobile for performance optimization
    const isMobile = window.innerWidth < 768;

    const bluePalette = ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7'];
    const shapes = ['circle', 'sparkle', 'star5', 'star6'];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function drawShape(ctx, shape, x, y, size, color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        // ... (Keep existing shape logic from previous code) ...
        if (shape === 'circle') {
            ctx.arc(x, y, size, 0, Math.PI * 2);
        } else if (shape === 'sparkle') {
            ctx.moveTo(x, y - size);
            ctx.quadraticCurveTo(x, y, x + size, y);
            ctx.quadraticCurveTo(x, y, x, y + size);
            ctx.quadraticCurveTo(x, y, x - size, y);
            ctx.quadraticCurveTo(x, y, x, y - size);
        } else if (shape === 'star5') {
            let spikes = 5; let outer = size; let inner = size/2; let rot=Math.PI/2*3; let step=Math.PI/spikes;
            ctx.moveTo(x, y-outer);
            for(let i=0; i<spikes; i++){
                ctx.lineTo(x+Math.cos(rot)*outer, y+Math.sin(rot)*outer); rot+=step;
                ctx.lineTo(x+Math.cos(rot)*inner, y+Math.sin(rot)*inner); rot+=step;
            }
            ctx.lineTo(x, y-outer);
        } else if (shape === 'star6') {
            let spikes = 6; let outer = size; let inner = size/2.5; let rot=Math.PI/2*3; let step=Math.PI/spikes;
            ctx.moveTo(x, y-outer);
            for(let i=0; i<spikes; i++){
                ctx.lineTo(x+Math.cos(rot)*outer, y+Math.sin(rot)*outer); rot+=step;
                ctx.lineTo(x+Math.cos(rot)*inner, y+Math.sin(rot)*inner); rot+=step;
            }
            ctx.lineTo(x, y-outer);
        }
        ctx.closePath();
        ctx.fill();
    }

    class Star {
        constructor(x, y, size, isSpawned = false, shape = 'circle') {
            this.x = x || Math.random() * width;
            this.y = y || Math.random() * height;
            this.size = size || Math.random() * 2;
            this.isSpawned = isSpawned;
            this.shape = shape; 
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.color = bluePalette[Math.floor(Math.random() * bluePalette.length)];
            this.opacity = Math.random() * 0.5 + 0.3;
            this.pulse = Math.random() * 0.02;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            if (this.isSpawned || this.size > 2.5) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
            }
            drawShape(ctx, this.shape, this.x, this.y, this.size, this.color);
            ctx.restore();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Gravity (Reduced range for mobile to prevent accidental pulls)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let maxDistance = isMobile ? 80 : 120; 

            if (distance < maxDistance) {
                let force = (maxDistance - distance) / maxDistance;
                let drift = force * 0.8;
                this.x += (dx / distance) * drift;
                this.y += (dy / distance) * drift;
            }

            this.opacity += this.pulse;
            if (this.opacity > 0.8 || this.opacity < 0.2) this.pulse = -this.pulse;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
    }

    function init() {
        resize();
        stars = [];
        // Performance: Fewer stars on mobile
        let count = isMobile ? 80 : 350;
        for (let i = 0; i < count; i++) {
            let type = Math.random() > 0.9 ? 'sparkle' : 'circle';
            stars.push(new Star(null, null, null, false, type));
        }
    }

    // --- Interaction (Mouse & Touch) ---
    function setInput(x, y, down) {
        mouse.x = x;
        mouse.y = y;
        isMouseDown = down;
        
        if (down) {
            let randomShape = shapes[Math.floor(Math.random() * shapes.length)];
            growingStar = { x: mouse.x, y: mouse.y, size: 1, color: '#ffffff', shape: randomShape };
        } else if (growingStar) {
            let s = new Star(growingStar.x, growingStar.y, growingStar.size, true, growingStar.shape);
            s.vx = (Math.random() - 0.5) * 1.5;
            s.vy = (Math.random() - 0.5) * 1.5;
            s.color = bluePalette[Math.floor(Math.random() * bluePalette.length)];
            stars.push(s);
            growingStar = null;
        }
    }

    // Mouse Events
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mousedown', (e) => setInput(e.clientX, e.clientY, true));
    window.addEventListener('mouseup', () => setInput(mouse.x, mouse.y, false));

    // Touch Events
    window.addEventListener('touchstart', (e) => {
        // e.preventDefault(); // Optional: Uncomment to block scroll while touching canvas
        setInput(e.touches[0].clientX, e.touches[0].clientY, true);
    }, {passive: false});

    window.addEventListener('touchmove', (e) => {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        if(growingStar) { growingStar.x = mouse.x; growingStar.y = mouse.y; }
    }, {passive: false});

    window.addEventListener('touchend', () => setInput(mouse.x, mouse.y, false));

    function animate() {
        ctx.clearRect(0, 0, width, height);
        stars.forEach(star => { star.update(); star.draw(); });

        if (isMouseDown && growingStar) {
            if (isMobile) { growingStar.x = mouse.x; growingStar.y = mouse.y; } // Explicit update for touch
            if (growingStar.size < 10) growingStar.size += 0.5;
            ctx.save();
            ctx.shadowBlur = 20 + growingStar.size;
            ctx.shadowColor = '#38bdf8';
            drawShape(ctx, growingStar.shape, growingStar.x, growingStar.y, growingStar.size, growingStar.color);
            ctx.restore();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();
});
