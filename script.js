function updateGreeting() {
    const name = document.getElementById('nameInput').value.trim();
    const greeting = document.getElementById('greeting');
    if (name) {
        greeting.textContent = `Hello, ${name}!`;
    } else {
        greeting.textContent = 'Hello, World!';
    }
}
