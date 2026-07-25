/**
 * AI Voice Wave Logic & Cinematic Typing
 */
document.addEventListener('DOMContentLoaded', () => {
    const waves = document.querySelectorAll('.wave');
    const typewriter = document.getElementById('typewriter');
    
    // Simulate voice activity
    let isSpeaking = true;
    
    setInterval(() => {
        if (!isSpeaking) {
            waves.forEach(w => w.style.height = '10px');
            return;
        }
        
        waves.forEach(w => {
            const h = Math.random() * 80 + 20;
            w.style.height = `${h}px`;
        });
    }, 100);

    // Cinematic Typewriter
    const msg = "Good morning, Commander. All systems are operating at peak efficiency. We are ready to initiate the launch sequence when you are.";
    let i = 0;
    
    setTimeout(() => {
        const type = setInterval(() => {
            if (i < msg.length) {
                typewriter.textContent += msg.charAt(i);
                i++;
            } else {
                clearInterval(type);
                isSpeaking = false;
            }
        }, 50); // Typing speed
    }, 1000);
});
