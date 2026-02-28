const button = document.getElementById('pingButton');
const status = document.getElementById('status');

button.addEventListener('click', async () => {
    // Disable button and show sending state
    button.disabled = true;
    button.classList.add('sending');
    status.textContent = 'Sending...';
    
    try {
        const response = await fetch('/api/notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Your friend wants to chat!',
                timestamp: new Date().toISOString()
            })
        });
        
        if (response.ok) {
            status.textContent = '✅ Sent! They\'ll get your message.';
            button.querySelector('.button-text').textContent = 'Sent! 🎉';
        } else {
            throw new Error('Failed to send');
        }
    } catch (error) {
        status.textContent = '❌ Oops! Try again.';
        console.error(error);
    } finally {
        // Re-enable after 3 seconds
        setTimeout(() => {
            button.disabled = false;
            button.classList.remove('sending');
            button.querySelector('.button-text').textContent = 'Tap to let them know 👋';
            status.textContent = '';
        }, 3000);
    }
});