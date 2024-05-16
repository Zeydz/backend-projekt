document.addEventListener("DOMContentLoaded", async () => {
  /* Hämta menyn när sidan laddas */
  try {
    await fetchReservationAndRender();
    await fetchMenuAndRender();
  } catch (error) {
    console.error("Kunde inte skriva ut meny och reservation", error);
  }

  /* Funktion för att hämta meny */
  async function fetchMenuAndRender() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://backend-projekt-api.onrender.com/api/menu", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Kunde inte hämta menyn");
      }
      const menuItems = await response.json();
      renderMenu(menuItems);
    } catch (error) {
      console.error("Fel vid hämtning av meny:", error);
    }
  }
  /* Funktion för att skriva ut de olika menyerna till DOM */
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
      /* Ta bort knapp */
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Ta bort";
      deleteBtn.classList.add("delete-button");
      deleteBtn.setAttribute("data-post-id", item._id);
      /* Ändra knapp */
      const editBtn = document.createElement("button");
      editBtn.textContent = "Ändra";
      editBtn.classList.add("edit-button");
      editBtn.setAttribute("data-post-id", item._id);
      menuBox.appendChild(menuItemHeader);
      menuBox.appendChild(menuItemDescription);
      menuBox.appendChild(menuItemPrice);
      menuBox.appendChild(deleteBtn);
      menuBox.appendChild(editBtn);
      menuContainer.appendChild(menuBox);
    });
    attachDeleteEventListeners();
  }

  /* Lägga till attribut med id på varje meny */
  async function attachDeleteEventListeners() {
    const menuContainer = document.querySelector(".menu-container");
    menuContainer.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("edit-button")) {
        const menuBox = target.closest(".menu-box");
        const postId = target.getAttribute("data-post-id");
        editMenu(postId, menuBox);
      }
    });
    /* Eventlistener för menyknapparna (ta bort) */
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const postID = button.getAttribute("data-post-id");
        deleteMenu(postID);
      });
    });

    /* Eventlistener för bokningsknapparna (ta bort) */
    const deleteButtons2 = document.querySelectorAll(".delete-button2");
    deleteButtons2.forEach((button) => {
      button.addEventListener("click", () => {
        const postID = button.getAttribute("data-post-id");
        deleteRes(postID);
      });
    });
  }

  /* Ta bort meny */
  async function deleteMenu(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://backend-projekt-api.onrender.com/api/menu/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer; ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Kunde inte hämta menyn");
      }
      fetchMenuAndRender();
    } catch (error) {
      console.error("Något gick fel:", error);
    }
  }

  /*  Funktion för att ändra en befintlig meny. Skickar med menyid i fetch. */
  function editMenu(menuId, menuBox) {
    /* Kontrollera ifall editForm redan finns. */
    const existingEditForm = menuBox.querySelector(".edit-form");
    const token = localStorage.getItem("token");
    if (existingEditForm) {
      existingEditForm.remove();
    }
    /* Fetchar vald menyid */
    fetch(`https://backend-projekt-api.onrender.com/api/menu/${menuId}`, {
      headers: {
        "Authorization": `Bearer; ${token}`,
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Kunde inte hämta menyinformation");
        }
        return response.json();
      })
      .then((menuData) => {
        /* Upplägg på DOM vid utskrift */
        const editForm = document.createElement("form");
        editForm.classList.add("edit-form");
        editForm.innerHTML = `
        <h2>Redigera meny</h2>
        <label for="editName">Namn:</label>
        <input type="text" id="editName" value="${menuData.itemName}" required>
        <label for="editDesc">Beskrivning:</label>
        <input type="text" id="editDesc" value="${menuData.description}" required>
        <label for="editPrice">Pris:</label>
        <input type="text" id="editPrice" value="${menuData.price}" required><br>
        <button type="submit">Spara</button>
        <button type="button" class="cancel-btn">Avbryt</button>`;

        /* menuBox appendar allt */
        menuBox.appendChild(editForm);

        /* Eventlistener som körs när man klickar på spara, uppdaterar data */
        editForm.addEventListener("submit", (e) => {
          e.preventDefault();

          const updatedMenuData = {
            itemName: document.getElementById("editName").value,
            description: document.getElementById("editDesc").value,
            price: document.getElementById("editPrice").value,
          };

          fetch(`https://backend-projekt-api.onrender.com/api/menu/${menuId}`, {
            method: "PUT",
            headers: {
              'Authorization': `Bearer; ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedMenuData),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Kunde inte uppdatera meny");
              }
              return response.json();
            })
            .then((updatedMenu) => {
              editForm.remove();
              fetchMenuAndRender();
            })
            .catch((error) => {
              console.error("Något gick fel:", error);
            });
        });
        /* Eventlistener för att avbryta ändring */
        const cancelButton = editForm.querySelector(".cancel-btn");
        cancelButton.addEventListener("click", () => {
          editForm.remove();
        });
      })
      .catch((error) => {
        console.error("Något gick fel:", error);
      });
  }

  /* Lägga till meny */
  const menuContEl = document.querySelector(".flex-menu");
  const addMenuBtn = document.getElementById("add-btn");
  const addFormEl = document.getElementById("addform");
  addMenuBtn.addEventListener("click", () => {
    const addMenuForm = document.createElement("form");
    const token = localStorage.getItem('token');
    addMenuForm.classList.add("add-form");
    addMenuForm.innerHTML = `
    <h2>Lägg till meny </h2>
    <label for="itemName">Namn:</label><br>
    <input type="text" id="itemName" required><br>
    <label for="description">Beskrivning:</label><br>
    <input type="text" id="description" required><br>
    <label for="price">Pris:</label><br>
    <input type="number" id="price" required><br>
    <button type="submit">Spara</button>
    <button type="button" class="cancel-btn">Avbryt</button>
    `;
    addFormEl.style.display = "block";

    /* Eventlistener för att spara en ny meny */
    addMenuForm.addEventListener("submit", (e) => {
      e.preventDefault();

      /* Värden från formuläret */
      const itemName = document.getElementById("itemName").value;
      const description = document.getElementById("description").value;
      const price = document.getElementById("price").value;

      fetch("https://backend-projekt-api.onrender.com/api/menu", {
        method: "POST",
        headers: {
          'Authorization': `Bearer; ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemName,
          description,
          price,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Kunde inte lägga till meny");
          }
          return response.json();
        })
        .then((newMenu) => {
          addMenuForm.remove();
          addFormEl.style.display = "none";
          addMenuBtn.style.display = "block";
          fetchMenuAndRender();
        })
        .catch((error) => {
          console.error("Något gick fel", error);
        });
    });
    /* Avbryt knapp */
    const cancelButton = addMenuForm.querySelector(".cancel-btn");
    cancelButton.addEventListener("click", () => {
      addMenuForm.remove();
      addFormEl.style.display = "none";
      addMenuBtn.style.display = "block";
    });
    addMenuBtn.style.display = "none";
    addFormEl.appendChild(addMenuForm);
  });

  /* -------------------- Här börjar bokning ----------------------- */
  /* Fetcha reservation */
  async function fetchReservationAndRender() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch("https://backend-projekt-api.onrender.com/api/bookings", {
        headers: {
          'Authorization': `Bearer; ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error("Kunde inte hämta reservationer");
      }
      const resItems = await response.json();
      renderRes(resItems);
    } catch (error) {
      console.error("Fel vid hämtning av meny:", error);
    }
  }

  /* Funktion för att skriva ut de olika bokningarna till DOM */
  function renderRes(resItems) {
    const resContainer = document.querySelector(".res-container");
    /* Rensa innehåll sedan tidigare */
    resContainer.innerHTML = "";
    /* Loopa igenom och skriv ut, lägger till ID från MongoDB till knapp */
    resItems.forEach((item) => {
      const resBox = document.createElement("div");
      resBox.classList.add("res-box");
      const resItemHeader = document.createElement("p");
      resItemHeader.textContent = `Namn: ${item.name}`;

      const resItemGuests = document.createElement("p");
      resItemGuests.textContent = `Antal gäster: ${item.numberOfGuests}`;

      const resItemDate = document.createElement("p");
      const date = new Date(item.date);
      const formattedDate = date.toLocaleDateString("sv-SE");
      resItemDate.textContent = `Datum: ${formattedDate}`;

      const resItemTime = document.createElement("p");
      resItemTime.textContent = `Tid: ${item.time}`;

      const resItemPhone = document.createElement("p");
      resItemPhone.textContent = `Tel: ${item.phone}`;

      const resItemMessage = document.createElement("p");
      resItemMessage.textContent = `Meddelande: ${item.message}`;

      /* Ta bort knapp */
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Ta bort";
      deleteBtn.classList.add("delete-button2");
      deleteBtn.setAttribute("data-post-id", item._id);
      resBox.appendChild(resItemHeader);
      resBox.appendChild(resItemPhone);
      resBox.appendChild(resItemGuests);
      resBox.appendChild(resItemDate);
      resBox.appendChild(resItemTime);
      resBox.appendChild(resItemMessage);
      resBox.appendChild(deleteBtn);
      resContainer.appendChild(resBox);
    });
    attachDeleteEventListeners();
  }

  /* Ta bort bokning*/
  async function deleteRes(id) {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://backend-projekt-api.onrender.com/bookings/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer; ${token}`,
          "Content-Type": "application/json",
        },
      });
      if(!response.ok) {
        throw new Error('Kunde inte ta bort meny')
      }
      fetchReservationAndRender();
    } catch (error) {
      console.error("Något gick fel:", error);
    }
  }
});
