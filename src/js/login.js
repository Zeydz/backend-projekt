document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const errormessageEl = document.getElementById('error-message');
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password})
        }) 
        .then(response => {
            if (!response.ok) {
                throw new Error('Inloggning misslyckades.')
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.response.token);
            window.location.href = '/admin.html'
        })
        .catch (error => {
            errormessageEl.textContent = 'Fel användarnamn / lösenord'
            console.error('Inloggning misslyckades', error);
        })
    }) 
})