
class SceneEngine {
    constructor() {
        this.cursor = null;
        this.stage = null;
        this.veil = null;
        this.canvas = null;
        this.ctx = null;
        
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.targetMouseX = this.mouseX;
        this.targetMouseY = this.mouseY;

        // Particle system for deep space
        this.particles = [];
        
        this.init();
    }

    init() {
        this.createGlobalElements();
        this.initCursor();
        this.initCanvas();
        this.initPageTransition();
        this.initHoverEffects();
        
        // Start render loop
        this.render();
    }

    createGlobalElements() {
        // Only inject if they don't exist
        if (!document.getElementById('director-cursor')) {
            this.cursor = document.createElement('div');
            this.cursor.id = 'director-cursor';
            document.body.appendChild(this.cursor);
        } else {
            this.cursor = document.getElementById('director-cursor');
        }

        if (!document.getElementById('scene-veil')) {
            this.veil = document.createElement('div');
            this.veil.id = 'scene-veil';
            document.body.appendChild(this.veil);
        } else {
            this.veil = document.getElementById('scene-veil');
        }

        if (!document.getElementById('film-overlay')) {
            const film = document.createElement('div');
            film.id = 'film-overlay';
            document.body.appendChild(film);
        }

        this.stage = document.getElementById('cinematic-stage');
    }

    initCursor() {
        document.addEventListener('mousemove', (e) => {
            this.targetMouseX = e.clientX;
            this.targetMouseY = e.clientY;
        });
    }

    initCanvas() {
        this.canvas = document.getElementById('engine-canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'engine-canvas';
            document.body.insertBefore(this.canvas, document.body.firstChild);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Generate particles
        for(let i=0; i<300; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * 2 + 0.1, // Depth for parallax
                size: Math.random() * 2,
                alpha: Math.random(),
                speed: (Math.random() - 0.5) * 0.2
            });
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initPageTransition() {
        // Reveal scene on load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.veil.classList.add('hidden');
                if (this.stage) this.stage.style.opacity = '1';
            }, 100);
        });

        // Intercept links for smooth out-transition
        document.querySelectorAll('a').forEach(link => {
            if (link.getAttribute('target') === '_blank' || link.getAttribute('href').startsWith('#')) return;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = link.getAttribute('href');
                
                this.veil.classList.remove('hidden');
                if (this.stage) this.stage.style.transform = 'translateZ(-500px) scale(0.9)';
                if (this.stage) this.stage.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = url;
                }, 1000); // Matches cinematic transition duration
            });
        });
    }

    initHoverEffects() {
        const interactables = document.querySelectorAll('a, button, .magnetic');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hover-state'));
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover-state');
                el.style.transform = 'translate(0px, 0px)';
            });
            
            if (el.classList.contains('magnetic')) {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = (e.clientX - rect.left - rect.width/2) * 0.3;
                    const y = (e.clientY - rect.top - rect.height/2) * 0.3;
                    el.style.transform = `translate(${x}px, ${y}px)`;
                });
            }
        });
    }

    render() {
        // Smooth cursor interpolation
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.2;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.2;
        
        if (this.cursor) {
            this.cursor.style.left = `${this.mouseX}px`;
            this.cursor.style.top = `${this.mouseY}px`;
        }

        // Apply 3D tilt to Stage if it exists
        if (this.stage) {
            const rx = (this.mouseY / window.innerHeight - 0.5) * -4; // Subtle tilt
            const ry = (this.mouseX / window.innerWidth - 0.5) * 4;
            this.stage.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        }

        // Draw Canvas particles
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        
        this.particles.forEach(p => {
            // Parallax shift based on mouse distance from center
            const shiftX = (this.mouseX - cx) * 0.005 * p.z;
            const shiftY = (this.mouseY - cy) * 0.005 * p.z;
            
            // Drift
            p.x += p.speed;
            if (p.x > this.canvas.width + 50) p.x = -50;
            if (p.x < -50) p.x = this.canvas.width + 50;

            this.ctx.beginPath();
            this.ctx.arc(p.x - shiftX, p.y - shiftY, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.render());
    }
}

// Start Engine
const AURORA_ENGINE = new SceneEngine();
