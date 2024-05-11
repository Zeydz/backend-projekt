document.addEventListener('DOMContentLoaded', () => {
    // Hämta menyn från backend när sidan laddas
    fetch('http://localhost:3000/api/menu')
        .then(response => {
            if (!response.ok) {
                throw new Error('Kunde inte hämta menyn.');
            }
            return response.json();
        })
        .then(menuItems => {
            // Rendera menyn på sidan
            renderMenu(menuItems);
        })
        .catch(error => {
            console.error('Fel vid hämtning av meny:', error);
        });

    function renderMenu(menuItems) {
        const menuContainer = document.querySelector('.menu-container');
        // Rensa tidigare innehåll i menyn
        menuContainer.innerHTML = '';
        // Loopa igenom menyobjekten och skapa HTML-element för varje menyobjekt
        menuItems.forEach(item => {
            const menuBox = document.createElement('div');
            menuBox.classList.add('menu-box');
            const menuItemHeader = document.createElement('h3');
            menuItemHeader.textContent = `${item.itemName} ----- ${item.price} kr`;
            const menuItemDescription = document.createElement('p');
            menuItemDescription.textContent = item.description;
            menuBox.appendChild(menuItemHeader);
            menuBox.appendChild(menuItemDescription);
            menuContainer.appendChild(menuBox);
        });
    }
});
