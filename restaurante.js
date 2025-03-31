window.onload = () => {
        const URL_API = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhCgG_ATRZS9ueB9UDo47MCAFnvsY9-Ci6TM9lD5DWyLZbIw078qIWQqHn0uBdXQdOWPVoVzWf5vjWS7iLPhKXY2z-4fljxl6T0PPU4UV4H0SELNS3oGIq6U3pbwoJr_W8rUKIL-GsDv1wG410tn6SqjJZy7KruXVxR1_IZ2kC9WXP3D3TtqycpFfjNNJVCQbGvMpfD9txRTmUgIWUKkpoPqYj86_aXYxy7lGCR3no7S5TsPniF1j7TUAGO1gjygBQBhlI9Y7sYNaUlrECPR9DQUiZOTQ&lib=MMIL2yF0RE_w_6F5I9VPw8dTystS0gYhU"; 
        fetch(URL_API)
    .then(res => res.json())
    .then(data => {
      // data.data es el array con los productos
      const productos = data.data;
      // Llamamos a una función que dibuje esos productos
      dibujarProductos(productos);
    })
    .catch(error => console.error("Error al obtener menú:", error));

    function dibujarProductos(productos) {
        const container = document.getElementById("itemsMenu");
        container.innerHTML = ""; // Limpio por si acaso
        let catActual="";
        productos.forEach(prod => {
          if(catActual!=prod.categoria){ //Revisamos si la categoria es diferente a la anterior
            const h2 = document.createElement("h2");
            h2.textContent = prod.categoria+"s";
            container.appendChild(h2);
            const section = document.createElement("section");
            productos.forEach(p => {
              if (p.categoria === prod.categoria) {
                const button = document.createElement("button");
                button.innerHTML = `
                  <div>
                    <img src="${p.imagen}" alt="${p.nombre}">
                    <div>
                      <p>${p.nombre}</p>
                      <span>$${p.precio}</span>
                    </div>
                  </div>
                  <span>${p.descripcion}</span>
                `;
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
              
                // Insertamos ese button en el contenedor
                container.appendChild(button);
                section.appendChild(button);
              }
            });
            container.appendChild(section);  
          }
          catActual=prod.categoria;
          // Agregamos el evento para añadir al carrito
        });
      }
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
};