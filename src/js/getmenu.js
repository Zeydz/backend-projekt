/* Hämta meny på startsida */
document.addEventListener("DOMContentLoaded", () => {
  /* Hämta menyn när sidan laddas */
  showLoadingSpinner();
  fetch("https://backend-projekt-api.onrender.com/api/menu")
    .then((response) => {
      if (!response.ok) {
        const errorMenu = document.getElementById("error-menu");
        errorMenu.innerHTML =
          "<p>Kunde inte hämta menyn, försök igen senare.</p>";
        hideLoadingSpinner();
        throw new Error("Kunde inte hämta menyn.");
      }
      return response.json();
    })
    .then((menuItems) => {
      /* Rendera meny på webbplats */
      hideLoadingSpinner();
      renderMenu(menuItems);
    })
    .catch((error) => {
      console.error("Fel vid hämtning av meny:", error);
    });

  function renderMenu(menuItems) {
    const menuContainer = document.querySelector(".menu-container");
    /* Loopa igenom och skriv ut */
    menuContainer.innerHTML = "";
    menuItems.forEach((item) => {
      const menuBox = document.createElement("div");
      menuBox.classList.add("menu-box");
      const menuItemHeader = document.createElement("h3");
      menuItemHeader.innerHTML = `${item.itemName} <i class="fa-solid fa-minus" style="color: #ffffff; width: 30px;"></i> ${item.price} kr`;
      const menuItemDescription = document.createElement("p");
      menuItemDescription.textContent = item.description;
      menuBox.appendChild(menuItemHeader);
      menuBox.appendChild(menuItemDescription);
      menuContainer.appendChild(menuBox);
    });
  }

  /* Skicka bokning till API/DB */
  const formEl = document.getElementById("res-send");
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    /* Värden från formuläret */
    const name = document.getElementById("name").value;
    const phone = document.getElementById("tel").value;
    const person = document.getElementById("person").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const message = document.getElementById("message").value;
    const status = document.getElementById('status');

    if(!name || !phone || !person || !date || !time) {
      alert('Vänligen fyll i alla obligatoriska fält');
      return;
    }
    fetch("https://backend-projekt-api.onrender.com/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        numberOfGuests: person,
        date: date,
        time: time,
        message: message,
      }),
      
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Kunde inte lägga till meny");
        }
        status.textContent = 'Bokning skickad!'
        status.style.color = 'Green'
        return response.json();
      })
      .catch((error) => {
        status.textContent = 'Bokning misslyckades!'
        status.style.color = 'Red'
        console.error("Något gick fel", error);
      });
  });

  /* Laddningsanimation som visar spinnern */
  function showLoadingSpinner() {
    document.getElementById("loadingSpinner").style.display = "block";
  }
  /* Laddningsanimation som gömmer spinnern */
  function hideLoadingSpinner() {
    document.getElementById("loadingSpinner").style.display = "none";
  }
});