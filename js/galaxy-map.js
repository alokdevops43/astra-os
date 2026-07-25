

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('deep-galaxy-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    
    
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let lastX, lastY;

    // Data
    const systems = [];
    const numSystems = 100;

    for (let i = 0; i < numSystems; i++) {
        systems.push({
            x: (Math.random() - 0.5) * 3000,
            y: (Math.random() - 0.5) * 3000,
            size: Math.random() * 4 + 1,
            hue: Math.random() > 0.5 ? 190 : (Math.random() > 0.5 ? 280 : 10),
            name: `SYS-${Math.floor(Math.random() * 9999)}`,
            connections: []
        });
    }

    // Connect close systems
    systems.forEach(s => {
        systems.forEach(s2 => {
            if (s === s2) return;
            const dist = Math.hypot(s.x - s2.x, s.y - s2.y);
            if (dist < 300 && s.connections.length < 3) {
                s.connections.push(s2);
            }
        });
    });

    // Ship warp trail
    let shipX = systems[0].x;
    let shipY = systems[0].y;
    let target = systems[1];
    let shipProgress = 0;

    // Event Listeners for panning
    canvas.addEventListener('mousedown', e => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        offsetX += (e.clientX - lastX) / scale;
        offsetY += (e.clientY - lastY) / scale;
        lastX = e.clientX;
        lastY = e.clientY;
    });
    canvas.addEventListener('wheel', e => {
        const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
        scale *= zoomDelta;
        scale = Math.max(0.2, Math.min(scale, 5));
    });

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        ctx.save();
        ctx.translate(width/2, height/2);
        ctx.scale(scale, scale);
        ctx.translate(offsetX, offsetY);

        // Draw connections
        ctx.lineWidth = 0.5 / scale;
        systems.forEach(s => {
            s.connections.forEach(c => {
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(c.x, c.y);
                ctx.strokeStyle = `hsla(${s.hue}, 100%, 50%, 0.1)`;
                ctx.stroke();
            });
        });

        // Draw systems
        systems.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${s.hue}, 100%, 70%)`;
            ctx.fill();
            
            // Glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = ctx.fillStyle;
            ctx.fill();
            ctx.shadowBlur = 0;

            if (scale > 0.8) {
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.font = `${10 / scale}px "Space Grotesk"`;
                ctx.fillText(s.name, s.x + 10, s.y - 10);
            }
        });

        // Draw Ship Warp Trail
        shipProgress += 0.005;
        if (shipProgress >= 1) {
            shipProgress = 0;
            shipX = target.x; shipY = target.y;
            if (target.connections.length > 0) {
                target = target.connections[Math.floor(Math.random() * target.connections.length)];
            }
        }
        
        const curX = shipX + (target.x - shipX) * shipProgress;
        const curY = shipY + (target.y - shipY) * shipProgress;

        ctx.beginPath();
        ctx.arc(curX, curY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#fff';
        
        // Trail
        ctx.beginPath();
        ctx.moveTo(shipX, shipY);
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2 / scale;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.restore();
        requestAnimationFrame(draw);
    }

    draw();
});
