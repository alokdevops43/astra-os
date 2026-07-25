document.addEventListener('DOMContentLoaded', async () => {
    const logsContainer = document.getElementById('boot-logs');
    const progressBar = document.getElementById('boot-progress');
    
    const logs = [
        { msg: "Mounting core file systems...", type: "normal", delay: 800 },
        { msg: "Mounting successful.", type: "success", delay: 500 },
        { msg: "Initializing Life Support subroutines...", type: "normal", delay: 1000 },
        { msg: "Warning: Port thermal manifold variance detected.", type: "error", delay: 1200 },
        { msg: "Auto-correcting thermal variance...", type: "normal", delay: 800 },
        { msg: "Thermal variance corrected.", type: "success", delay: 400 },
        { msg: "Aligning FTL parameters...", type: "normal", delay: 1500 },
        { msg: "FTL alignment nominal.", type: "success", delay: 500 },
        { msg: "Connecting to Deep Space Network...", type: "normal", delay: 1000 },
        { msg: "Connection established. Latency: 0.2ms", type: "success", delay: 600 },
        { msg: "Waking AI Core...", type: "normal", delay: 1200 },
        { msg: "AI Core Online. Ready for command.", type: "success", delay: 800 }
    ];

    let progress = 0;
    
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    for (let i = 0; i < logs.length; i++) {
        await sleep(logs[i].delay);
        
        const line = document.createElement('div');
        line.className = `log-line ${logs[i].type}`;
        line.textContent = `> ${logs[i].msg}`;
        logsContainer.appendChild(line);
        
        logsContainer.scrollTop = logsContainer.scrollHeight;
        
        progress = ((i + 1) / logs.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    await sleep(1500);
    
    // Automatically transition to Mission Control via the Engine's veil logic
    if (window.AURORA_ENGINE) {
        window.AURORA_ENGINE.veil.classList.remove('hidden');
        window.AURORA_ENGINE.stage.style.transform = 'translateZ(-500px) scale(0.9)';
        window.AURORA_ENGINE.stage.style.opacity = '0';
        setTimeout(() => {
            window.location.href = 'mission-control.html';
        }, 1000);
    } else {
        window.location.href = 'mission-control.html';
    }
});
