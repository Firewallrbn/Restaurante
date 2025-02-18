document.addEventListener("DOMContentLoaded", () => {
    const asideElement = document.querySelector("aside");
    const ordenesActualesDiv = document.querySelector(".ordenesActuales");
    
    // Inicialmente, asegúrate de que ambos estén ocultos inline.
    asideElement.style.display = "none";
    ordenesActualesDiv.style.display = "none";
  
    const ordenActualList = document.createElement("ul");
    ordenActualList.id = "ordenActual";
    ordenesActualesDiv.appendChild(ordenActualList);
  
    // Selecciona todos los botones de productos
    const productButtons = document.querySelectorAll(".itemsMenu button");
    
    productButtons.forEach(button => {
      button.addEventListener("click", () => {
        const itemName = button.querySelector("p").textContent;
        const itemPrice = button.querySelector("span").textContent;
        
        // Crea y añade el <li>
        const listItem = document.createElement("li");
        listItem.textContent = `${itemName} - ${itemPrice}`;
        ordenActualList.appendChild(listItem);
  
        // Muestra aside si está oculto
        if (asideElement.style.display === "none") {
          asideElement.style.display = "block";
        }
        // Muestra .ordenesActuales si está oculta
        if (ordenesActualesDiv.style.display === "none") {
          ordenesActualesDiv.style.display = "block";
        }
      });
    });
  });
  