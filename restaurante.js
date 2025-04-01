window.onload = () => {
  // URL que devuelve el menú (GET)
  const URL_MENU = "https://script.google.com/macros/s/AKfycbwpqaC6RhJ_QFBglo4GsSPdkRn5CFG0QrdCob2knohcUccdV5kKFlL6do7yJBDjGutc/exec"; 
  
  // URL a la cual hacer POST para guardar el pedido
  const URL_PEDIDOS = "https://script.google.com/macros/s/AKfycbwpqaC6RhJ_QFBglo4GsSPdkRn5CFG0QrdCob2knohcUccdV5kKFlL6do7yJBDjGutc/exec";

  // 1. Obtener referencia a los elementos del DOM
  const itemsMenuContainer = document.getElementById("itemsMenu");
  const asideElement = document.querySelector("aside");
  const ordenesActualesDiv = document.querySelector(".ordenesActuales");
  const totalElement = document.getElementById("total");
  const pedidoInput = document.getElementById("pedidoInput");
  const ordenActualList = document.getElementById("ordenesActuales");
  const realizarPedidoBtn = document.getElementById("realizarPedido");
  const modal = document.getElementById("modal");
  const closeModalBtn = document.getElementById("close-modal");
  const formCliente = document.getElementById("formCliente");

  // 2. Ocultar elementos iniciales
  asideElement.style.display = "none";
  ordenesActualesDiv.style.display = "none";
  // Asegúrate en tu CSS de tener el modal oculto por defecto, ej.:
  // #modal { display: none; }

  // 3. Variables para manejar carrito (ordenes) y total
  const ordenes = {};
  let total = 0;
  let catActual="";
  // 4. Pedir menú a la API (GET)
  fetch(URL_MENU)
    .then(res => res.json())
    .then(data => {
      const productos = data.data;
      dibujarProductos(productos);
    })
    .catch(error => console.error("Error al obtener menú:", error));

  // 5. Función para dibujar productos en el contenedor
  function dibujarProductos(productos) {
    const container = document.getElementById("itemsMenu");
        container.innerHTML = ""; // Limpio por si acaso
    itemsMenuContainer.innerHTML = ""; // Limpio contenedor por si acaso

    productos.forEach(prod => {
      if(catActual!=prod.categoria){ //Revisamos si la categoria es diferente a la anterior
        const h2 = document.createElement("h2");
        h2.textContent = prod.categoria+"s";
        container.appendChild(h2);
        const section = document.createElement("section");
        section.classList.add(prod.categoria+"s");
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
  // 6. Función para actualizar valor del input hidden con el detalle del pedido
  function actualizarPedido() {
    const pedidoArray = Object.keys(ordenes).map(item => ({
      nombre: item,
      cantidad: ordenes[item].cantidad,
      precio: ordenes[item].precioUnitario * ordenes[item].cantidad
    }));

    const pedidoTexto = pedidoArray
      .map(p => `${p.nombre} x${p.cantidad} - $${p.precio.toFixed(2)}`)
      .join(", ");
    pedidoInput.value = pedidoTexto;
  }

  // 7. Mostrar el modal cuando el usuario hace clic en "Realizar pedido"
  realizarPedidoBtn.addEventListener("click", (event) => {
    event.preventDefault(); 
    actualizarPedido();     
    modal.style.display = "block"; // Muestra el modal
  });

  // 8. Cerrar modal al hacer clic en la "X"
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // 9. Al enviar el formulario del modal, se realiza el POST
  formCliente.addEventListener("submit", async (event) => {
    event.preventDefault(); // evita recarga de la página
  
    // Tomar datos del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
  
    // Convertir carrito a array
    const pedidoArray = Object.keys(ordenes).map(item => ({
      nombre: item,
      cantidad: ordenes[item].cantidad,
      precioUnitario: ordenes[item].precioUnitario
    }));
  
    // Calcular el total
    const totalPedido = pedidoArray.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
  
    // Armar objeto final
    const pedido = {
      nombreCliente: nombre,
      telefonoCliente: telefono,
      direccionCliente: direccion,
      listaProductos: pedidoArray,
      valorTotal: totalPedido
    };
  
    try {
      // Realizar POST a tu WebApp
      const response = await fetch(URL_PEDIDOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(pedido)
      });
  
      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      // Cerrar el modal y notificar al usuario
      modal.style.display = "none";
      alert("¡Pedido enviado con éxito!");

      // Opcional: Reinicia el carrito
      for (const key in ordenes) {
        if (ordenes.hasOwnProperty(key)) {
          ordenes[key].elementoLi.remove(); 
        }
      }
      Object.keys(ordenes).forEach(k => delete ordenes[k]);
      total = 0;
      totalElement.textContent = "Total: $0";
      pedidoInput.value = "";

      asideElement.style.display = "none";
      ordenesActualesDiv.style.display = "none";

    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      alert("Ocurrió un error al enviar el pedido, intenta de nuevo.");
    }
  });
};
