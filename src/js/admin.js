document.addEventListener("DOMContentLoaded", () => {
  /* Hämta menyn när sidan laddas */
  fetchMenuAndRender();
  /* Funktion för att hämta meny */
  async function fetchMenuAndRender() {
    try {
      const response = await fetch("http://localhost:3000/api/menu");
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
  function attachDeleteEventListeners() {
    const menuContainer = document.querySelector(".menu-container");
    menuContainer.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("edit-button")) {
        const menuBox = target.closest(".menu-box");
        const postId = target.getAttribute("data-post-id");
        editMenu(postId, menuBox);
      }
    });

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
    } catch (error) {
      console.error("Något gick fel:", error);
    }
  }

  /*  Funktion för att ändra en befintlig kurs. Skickar med menyid i fetch. */
  function editMenu(menuId, menuBox) {
    /* Kontrollera ifall editForm redan finns. */
    const existingEditForm = menuBox.querySelector(".edit-form");
    if (existingEditForm) {
      existingEditForm.remove();
    }

    /* Fetchar vald menyid */
    fetch(`http://localhost:3000/api/menu/${menuId}`)
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
        <label for="editName">Namn:</label><br>
        <input type="text" id="editName" value="${menuData.itemName}" required><br>
        <label for="editDesc">Beskrivning:</label><br>
        <input type="text" id="editDesc" value="${menuData.description}" required><br>
        <label for="editPrice">Pris:</label><br>
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

          fetch(`http://localhost:3000/api/menu/${menuId}`, {
            method: "PUT",
            headers: {
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
              console.log("Skickat data");
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

      fetch("http://localhost:3000/api/menu", {
        method: "POST",
        headers: {
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
});
