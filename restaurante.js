document.addEventListener("DOMContentLoaded", () => {
    const asideElement = document.querySelector("aside");
    const ordenesActualesDiv = document.querySelector(".ordenesActuales");
    const totalElement = document.getElementById("total");

    // Ocultar aside y ordenes al inicio
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
                ordenes[itemName].elementoLi.querySelector(".cantidad").textContent = `x${ordenes[itemName].cantidad}`;
                ordenes[itemName].elementoLi.querySelector(".precio").textContent = `$${(ordenes[itemName].cantidad * itemPrice).toFixed(2)}`;
            } else {
                // Si el producto no está en la lista, agrégalo
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    ${itemName} <span class="cantidad">x1</span> - <span class="precio">$${itemPrice.toFixed(2)}</span>
                    <button class="borrar">Borrar</button>
                `;

                ordenActualList.appendChild(listItem);

                // Guardar en el objeto ordenes
                ordenes[itemName] = {
                    cantidad: 1,
                    precioUnitario: itemPrice,
                    elementoLi: listItem
                };

                // Agregar evento de borrar al botón
                listItem.querySelector(".borrar").addEventListener("click", () => {
                    total -= ordenes[itemName].cantidad * ordenes[itemName].precioUnitario; // Restar el precio total del producto eliminado
                    totalElement.textContent = `Total: $${total.toFixed(2)}`;

                    delete ordenes[itemName]; // Eliminar del objeto
                    listItem.remove();

                    // Ocultar aside si ya no hay productos
                    if (Object.keys(ordenes).length === 0) {
                        asideElement.style.display = "none";
                        ordenesActualesDiv.style.display = "none";
                    }
                });
            }

            // Actualizar el total
            total += itemPrice;
            totalElement.textContent = `Total: $${total.toFixed(2)}`;

            // Mostrar aside si está oculto
            asideElement.style.display = "block";
            ordenesActualesDiv.style.display = "block";
        });
    });
});