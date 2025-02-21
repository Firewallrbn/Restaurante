document.addEventListener("DOMContentLoaded", () => {
    const asideElement = document.querySelector("aside");
    const ordenesActualesDiv = document.querySelector(".ordenesActuales");
    const totalElement = document.getElementById("total");
    const pedidoInput = document.getElementById("pedidoInput");
    const ordenActualList = document.getElementById("ordenesActuales");
    const realizarPedidoBtn = document.getElementById("realizarPedido");

    asideElement.style.display = "none";
    ordenesActualesDiv.style.display = "none";

    const ordenes = {};
    let total = 0;

    const productButtons = document.querySelectorAll(".itemsMenu button");

    productButtons.forEach(button => {
        button.addEventListener("click", () => {
            const itemName = button.querySelector("p").textContent;
            const itemPrice = parseFloat(button.querySelector("span").textContent.replace("$", ""));

            if (ordenes[itemName]) {
                ordenes[itemName].cantidad++;
                ordenes[itemName].elementoLi.querySelector(".cantidad").textContent = `x${ordenes[itemName].cantidad}`;
                ordenes[itemName].elementoLi.querySelector(".precio").textContent = `$${(ordenes[itemName].cantidad * itemPrice).toFixed(2)}`;
            } else {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    ${itemName} <span class="cantidad">x1</span> - <span class="precio">$${itemPrice.toFixed(2)}</span>
                    <button class="borrar">-</button>
                `;
                ordenActualList.appendChild(listItem);

                ordenes[itemName] = {
                    cantidad: 1,
                    precioUnitario: itemPrice,
                    elementoLi: listItem
                };

                listItem.querySelector(".borrar").addEventListener("click", () => {
                    total -= ordenes[itemName].cantidad * ordenes[itemName].precioUnitario;
                    totalElement.textContent = `Total: $${total.toFixed(2)}`;

                    delete ordenes[itemName];
                    listItem.remove();

                    actualizarPedido();

                    if (Object.keys(ordenes).length === 0) {
                        asideElement.style.display = "none";
                        ordenesActualesDiv.style.display = "none";
                    }
                });
            }

            total += itemPrice;
            totalElement.textContent = `Total: $${total.toFixed(2)}`;
            actualizarPedido();

            asideElement.style.display = "block";
            ordenesActualesDiv.style.display = "block";
        });
    });

    function actualizarPedido() {
        const pedidoArray = Object.keys(ordenes).map(item => ({
            nombre: item,
            cantidad: ordenes[item].cantidad,
            precio: ordenes[item].precioUnitario * ordenes[item].cantidad
        }));

        const pedidoTexto = pedidoArray.map(p => `${p.nombre} x${p.cantidad} - $${p.precio.toFixed(2)}`).join(", ");
        pedidoInput.value = pedidoTexto;
    }

    realizarPedidoBtn.addEventListener("click", () => {
        actualizarPedido();
    });
});