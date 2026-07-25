/**
 * Launch Sequence & Warp Canvas Engine
 */
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-ignite');
    const timerText = document.getElementById('timer');
    const glow = document.getElementById('engine-glow');
    const smoke = document.getElementById('smoke');
    const rig = document.getElementById('camera-rig');
    const ui = document.getElementById('launch-ui');
    const nav = document.getElementById('global-nav');
    const rocket = document.getElementById('rocket');
    const warpCanvas = document.getElementById('warp-canvas');
    const warpCtx = warpCanvas.getContext('2d');
    
    let w = window.innerWidth;
    let h = window.innerHeight;
    warpCanvas.width = w;
    warpCanvas.height = h;

    window.addEventListener('resize', () => {
        w = window.innerWidth;
        h = window.innerHeight;
        warpCanvas.width = w;
        warpCanvas.height = h;
    });

    let stars = [];
    for(let i=0; i<400; i++) {
        stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            z: Math.random() * w,
            o: '0.'+Math.floor(Math.random() * 99) + 1
        });
    }

    let isWarping = false;
    let speed = 0;

    function renderWarp() {
        if (!isWarping) return;
        
        warpCtx.fillStyle = 'rgba(0,0,0,0.2)';
        warpCtx.fillRect(0, 0, w, h);
        
        const cx = w/2;
        const cy = h/2;

        for (let i=0; i<stars.length; i++) {
            let s = stars[i];
            
            s.z -= speed;
            if (s.z <= 0) {
                s.z = w;
                s.x = Math.random() * w;
                s.y = Math.random() * h;
            }

            let sx = (s.x - cx) * (w / s.z) + cx;
            let sy = (s.y - cy) * (w / s.z) + cy;

            let prevZ = s.z + speed;
            let px = (s.x - cx) * (w / prevZ) + cx;
            let py = (s.y - cy) * (w / prevZ) + cy;

            warpCtx.beginPath();
            warpCtx.moveTo(px, py);
            warpCtx.lineTo(sx, sy);
            warpCtx.lineWidth = (1 - s.z/w) * 3;
            warpCtx.strokeStyle = `rgba(255, 255, 255, ${s.o})`;
            warpCtx.stroke();
        }
        
        speed += 0.5; // Accelerate continuously
        if (speed > 150) speed = 150; // Max speed

        requestAnimationFrame(renderWarp);
    }

    btn.addEventListener('click', () => {
        btn.style.display = 'none';
        let countdown = 10;
        timerText.textContent = `T-MINUS ${countdown}`;
        
        // Ignite engine & smoke
        glow.classList.add('ignite');
        smoke.classList.add('active');
        rig.classList.add('shake');

        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                timerText.textContent = `T-MINUS ${countdown}`;
            } else {
                clearInterval(interval);
                timerText.textContent = `LIFTOFF`;
                timerText.style.color = '#10b981';
                timerText.style.textShadow = '0 0 20px #10b981';
                
                // Launch
                ui.style.opacity = '0';
                nav.style.opacity = '0';
                rocket.style.transform = `translateY(-200vh) scale(0.5)`; // Fly up
                
                setTimeout(() => {
                    // Enter Warp Speed
                    warpCanvas.style.opacity = '1';
                    isWarping = true;
                    renderWarp();
                    rig.classList.remove('shake');
                    
                    // Stop native engine canvas rendering to show warp
                    const mainCanvas = document.getElementById('engine-canvas');
                    if(mainCanvas) mainCanvas.style.opacity = '0';

                }, 3000);
            }
        }, 1000);
    });
});
