const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

// Reduce stars on mobile/slow devices, keep 200 on desktop
const STAR_COUNT = window.innerWidth < 768 ? 80 : 200; 

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5,
    s: Math.random() * 0.3 + 0.1
  });
}

function draw() {
  // OPTIMIZATION: clearRect is heavy on 4k screens.
  // Using fillRect with a slight opacity trails creates a cool effect 
  // AND is often faster than clearing transparent pixels.
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "white";
  ctx.beginPath(); // Batch drawing improves performance significantly
  
  for (let star of stars) {
    star.y += star.s;
    if (star.y > canvas.height) star.y = 0;

    // Move to next star without starting a new "draw" command every time
    ctx.moveTo(star.x, star.y);
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
  }
  
  ctx.fill(); // Draw all stars in one single paint operation
  requestAnimationFrame(draw);
}

draw();
