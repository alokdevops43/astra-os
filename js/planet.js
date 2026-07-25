/**
 * Image Parallax Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const bg = document.querySelector('.parallax-bg');
    const fg = document.querySelector('.parallax-fg');

    if (!bg || !fg) return;

    document.addEventListener('mousemove', (e) => {
        const mx = e.clientX / window.innerWidth - 0.5;
        const my = e.clientY / window.innerHeight - 0.5;

        // Background moves slightly opposite
        bg.style.transform = `translate(${mx * -20}px, ${my * -20}px) scale(1.05)`;
        
        // Foreground mountains move faster
        fg.style.transform = `translate(${mx * -60}px, ${my * -40}px) scale(1.1)`;
    });
});
