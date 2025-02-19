document.addEventListener("DOMContentLoaded", () => {
    const asideElement = document.querySelector("aside");
    const ordenesActualesDiv = document.querySelector(".ordenesActuales");
    const totalElement = document.getElementById("total"); // Seleccionamos el <p> existente

    // Inicialmente, oculta ambos elementos.
    asideElement.style.display = "none";
    ordenesActualesDiv.style.display = "none";

    const ordenActualList = document.createElement("ul");
    ordenActualList.id = "ordenActual";
    ordenesActualesDiv.appendChild(ordenActualList);

    // Objeto para rastrear productos agregados
    const ordenes = {};
    let total = 0; // Variable para almacenar el total

    const productButtons = document.querySelectorAll(".itemsMenu button");

    productButtons.forEach(button => {
        button.addEventListener("click", () => {
            const itemName = button.querySelector("p").textContent;
            const itemPrice = parseFloat(button.querySelector("span").textContent.replace("$", ""));

            if (ordenes[itemName]) {
                // Si el producto ya está en la lista, aumenta la cantidad
                ordenes[itemName].cantidad++;
                ordenes[itemName].elementoLi.textContent = `${itemName} x${ordenes[itemName].cantidad} - $${(ordenes[itemName].cantidad * itemPrice).toFixed(2)}`;
            } else {
                // Si el producto no está en la lista, agrégalo
                const listItem = document.createElement("li");
                listItem.textContent = `${itemName} x1 - $${itemPrice.toFixed(2)}`;
                ordenActualList.appendChild(listItem);

                // Guardar en el objeto ordenes
                ordenes[itemName] = {
                    cantidad: 1,
                    precioUnitario: itemPrice,
                    elementoLi: listItem
                };
            }

            // Actualizar el total
            total += itemPrice;
            totalElement.textContent = `Total: $${total.toFixed(2)}`;

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
