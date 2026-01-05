/* background-canvas.js */

// Run this only after the page has fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('star-canvas');
    
    // Safety check: if canvas doesn't exist in HTML, stop here
    if (!canvas) {
        console.error("Star canvas element not found!");
        return;
    }

    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let mouse = { x: -1000, y: -1000 };
    let isMouseDown = false;
    let growingStar = null;

    // Shades of Blue Palette (No gold/purple, just Blues & White)
    const bluePalette = [
        '#ffffff', // White
        '#e0f2fe', // Very light blue
        '#bae6fd', // Light blue
        '#7dd3fc', // Sky blue
        '#38bdf8', // Cyan
        '#0ea5e9', // Blue
        '#0284c7'  // Deep Blue
    ];

    // Available shapes
    const shapes = ['circle', 'sparkle', 'star5', 'star6'];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    // --- Shape Drawing Logic ---
    function drawShape(ctx, shape, x, y, size, color) {
        ctx.beginPath();
        ctx.fillStyle = color;

        if (shape === 'circle') {
            ctx.arc(x, y, size, 0, Math.PI * 2);
        } 
        else if (shape === 'sparkle') {
            // 4-point Diamond/Sparkle
            ctx.moveTo(x, y - size);
            ctx.quadraticCurveTo(x, y, x + size, y);
            ctx.quadraticCurveTo(x, y, x, y + size);
            ctx.quadraticCurveTo(x, y, x - size, y);
            ctx.quadraticCurveTo(x, y, x, y - size);
        } 
        else if (shape === 'star5') {
            // 5-Point Star
            let spikes = 5;
            let outerRadius = size;
            let innerRadius = size / 2;
            let rot = Math.PI / 2 * 3;
            let cx = x;
            let cy = y;
            let step = Math.PI / spikes;

            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
                rot += step;
                ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
                rot += step;
            }
            ctx.lineTo(cx, cy - outerRadius);
        }
        else if (shape === 'star6') {
            // 6-Point Star
            let spikes = 6;
            let outerRadius = size;
            let innerRadius = size / 2.5;
            let rot = Math.PI / 2 * 3;
            let cx = x;
            let cy = y;
            let step = Math.PI / spikes;

            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
                rot += step;
                ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
                rot += step;
            }
            ctx.lineTo(cx, cy - outerRadius);
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
            
            // Glow effect for larger stars
            if (this.isSpawned || this.size > 2.5) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
            } else {
                ctx.shadowBlur = 0;
            }

            drawShape(ctx, this.shape, this.x, this.y, this.size, this.color);
            ctx.restore();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Gravity Logic
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let maxDistance = 120; // Range of gravity

            if (distance < maxDistance) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (maxDistance - distance) / maxDistance;
                let drift = force * 0.8; 
                
                this.x += forceDirectionX * drift;
                this.y += forceDirectionY * drift;
            }

            // Twinkle
            this.opacity += this.pulse;
            if (this.opacity > 0.8 || this.opacity < 0.2) this.pulse = -this.pulse;

            // Wrap around screen
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
    }

    function init() {
        resize();
        stars = [];
        // Spawn background stars
        for (let i = 0; i < 350; i++) {
            let type = Math.random() > 0.9 ? 'sparkle' : 'circle';
            stars.push(new Star(null, null, null, false, type));
        }
    }

    // --- Interaction ---
    window.addEventListener('resize', resize);
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Random shape for new star
        let randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        
        growingStar = {
            x: mouse.x,
            y: mouse.y,
            size: 1,
            color: '#ffffff',
            shape: randomShape
        };
    });

    window.addEventListener('mouseup', () => {
        isMouseDown = false;
        if (growingStar) {
            let s = new Star(
                growingStar.x, 
                growingStar.y, 
                growingStar.size, 
                true, 
                growingStar.shape
            );
            // Give spawned stars random velocity
            s.vx = (Math.random() - 0.5) * 1.5; 
            s.vy = (Math.random() - 0.5) * 1.5;
            s.color = bluePalette[Math.floor(Math.random() * bluePalette.length)]; 
            
            stars.push(s);
            growingStar = null;
        }
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        // Draw growing star
        if (isMouseDown && growingStar) {
            growingStar.x = mouse.x;
            growingStar.y = mouse.y;
            
            // Allow it to grow larger (up to 30px)
            if (growingStar.size < 10) {
                growingStar.size += 0.5;
            }

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
