document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const errormessageEl = document.getElementById('error-message');
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        showLoadingSpinner();

        fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password})
        }) 
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    hideLoadingSpinner()
                    throw new Error('Ett fel inträffades.');
                    
                } else if (response.status === 401){
                    hideLoadingSpinner()
                    throw new Error('Fel användarnamn/lösenord.');
                } else {
                    hideLoadingSpinner()
                    throw new Error('Något gick fel. Försök igen senare.');
                }
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.response.token);
            window.location.href = '/admin.html'
        })
        .catch (error => {
            hideLoadingSpinner()
            errormessageEl.textContent = 'Fel användarnamn / lösenord'
            console.error('Inloggning misslyckades', error);
        })
    }) 
})

/* Laddningsanimation som visar spinnern */
function showLoadingSpinner() {
    document.getElementById("loadingSpinner").style.display = "block";
  }
  /* Laddningsanimation som gömmer spinnern */
  function hideLoadingSpinner() {
    document.getElementById("loadingSpinner").style.display = "none";
  }
  