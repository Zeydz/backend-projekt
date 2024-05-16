document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const errormessageEl = document.getElementById('error-message');
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        showLoadingSpinner();
        /* Fetch för logga in */
        fetch('https://backend-projekt-api.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password})
        }) 
        /* Hantering av olika felkoder */
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
        /* Spara token i localStorage och skicka vidare besökare till admin */
        .then(data => {
            localStorage.setItem('token', data.response.token);
            window.location.href = '/admin.html'
        })
        /* Hantera fel */
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
  