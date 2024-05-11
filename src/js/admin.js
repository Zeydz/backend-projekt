document.addEventListener("DOMContentLoaded", () => {
  /* Hämta menyn när sidan laddas */
  fetchMenuAndRender();

  async function fetchMenuAndRender() {
    try {
        const response = await fetch('http://localhost:3000/api/menu');
      if(!response.ok) {
        throw new Error('Kunde inte hämta menyn');
      }

      const menuItems = await response.json();
      renderMenu(menuItems);
    } catch (error) {
      console.error("Fel vid hämtning av meny:", error);
    }
  }


  function renderMenu(menuItems) {
    const menuContainer = document.querySelector(".menu-container");
    /* Rensa innehåll sedan tidigare */
    menuContainer.innerHTML = "";
    /* Loopa igenom och skriv ut, lägger till ID från MongoDB till knapp */
    menuItems.forEach((item) => {
      const menuBox = document.createElement("div");
      menuBox.classList.add("menu-box");
      const menuItemHeader = document.createElement("h3");
      menuItemHeader.textContent = `${item.itemName}`;
      const menuItemPrice = document.createElement("p");
      menuItemPrice.textContent = `${item.price} kr`;
      const menuItemDescription = document.createElement("p");
      menuItemDescription.textContent = item.description;
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Ta bort";
      deleteBtn.classList.add("delete-button");
      deleteBtn.setAttribute("data-post-id", item._id);
      menuBox.appendChild(menuItemHeader);
      menuBox.appendChild(menuItemDescription);
      menuBox.appendChild(menuItemPrice);
      menuBox.appendChild(deleteBtn);
      menuContainer.appendChild(menuBox);
    });
    attachDeleteEventListeners();
  }

  /* Funktion för att ta bort specifikt menyid från webbplatsen */
  function attachDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const postID = button.getAttribute("data-post-id");
        deleteMenu(postID);
      });
    });
  }
  /* Ta bort meny */
  async function deleteMenu(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/menu/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      fetchMenuAndRender();
      console.log(data.message);
    } catch (error) {
      console.error("Något gick fel:", error);
    }
  }
});
