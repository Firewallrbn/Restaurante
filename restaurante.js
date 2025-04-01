3window.onload = () => {
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
    itemsMenuContainer.innerHTML = ""; // Limpio contenedor por si acaso

    productos.forEach(prod => {
      // Crear un button con imagen, precio, descripción, etc.
      const button = document.createElement("button");
      button.innerHTML = `
        <div>
          <img src="${prod.imagen}" alt="${prod.nombre}">
          <div>
            <p>${prod.nombre}</p>
            <span>$${prod.precio}</span>
          </div>
        </div>
        <span>${prod.descripcion}</span>
      `;

      // Evento para añadir al carrito
      button.addEventListener("click", () => {
        const itemName = prod.nombre;
        const itemPrice = parseFloat(prod.precio);

        // Verificar si el producto ya existe en el carrito
        if (ordenes[itemName]) {
          ordenes[itemName].cantidad++;
          ordenes[itemName].elementoLi.querySelector(".cantidad").textContent = `x${ordenes[itemName].cantidad}`;
          ordenes[itemName].elementoLi.querySelector(".precio").textContent = `$${(ordenes[itemName].cantidad * itemPrice).toFixed(2)}`;
        } else {
          // Crear elemento <li> para mostrar en la lista de ordenes actuales
          const listItem = document.createElement("li");
          listItem.innerHTML = `
            ${itemName} <span class="cantidad">x1</span> - 
            <span class="precio">$${itemPrice.toFixed(2)}</span>
            <button class="borrar">-</button>
          `;
          ordenActualList.appendChild(listItem);

          // Guardar la info en el objeto "ordenes"
          ordenes[itemName] = {
            cantidad: 1,
            precioUnitario: itemPrice,
            elementoLi: listItem
          };

          // Evento para borrar el item desde la lista
          listItem.querySelector(".borrar").addEventListener("click", () => {
            total -= ordenes[itemName].cantidad * ordenes[itemName].precioUnitario;
            totalElement.textContent = `Total: $${total.toFixed(2)}`;

            delete ordenes[itemName];
            listItem.remove();

            actualizarPedido();

            // Si se queda sin pedidos, oculto aside y las órdenes
            if (Object.keys(ordenes).length === 0) {
              asideElement.style.display = "none";
              ordenesActualesDiv.style.display = "none";
            }
          });
        }

        // Actualizar total y mostrar aside
        total += itemPrice;
        totalElement.textContent = `Total: $${total.toFixed(2)}`;
        actualizarPedido();
        asideElement.style.display = "block";
        ordenesActualesDiv.style.display = "block";
      });

      // Insertar button en el contenedor
      itemsMenuContainer.appendChild(button);
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
