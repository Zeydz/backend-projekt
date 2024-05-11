/* Hämta meny på startsida */
document.addEventListener("DOMContentLoaded", () => {
  /* Hämta menyn när sidan laddas */
  fetch("http://localhost:3000/api/menu")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Kunde inte hämta menyn.");
      }
      return response.json();
    })
    .then((menuItems) => {
      /* Rendera meny på webbplats */
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
});
