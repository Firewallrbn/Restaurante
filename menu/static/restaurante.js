/* static/restaurante.js  */
window.onload = () => {

  /* 1️⃣  Rutas ------------------------------ */
  const URL_MENU    = "https://restaurante-yfuf.onrender.com/api/menu";
  /* ‼️  ahora apuntamos al endpoint de Django */
  const URL_PEDIDOS = "https://restaurante-yfuf.onrender.com/api/pedido/";


  /* 2️⃣  Selectores / variables ------------- */
  const itemsMenuContainer = document.getElementById("itemsMenu");
  const asideElement       = document.querySelector("aside");
  const ordenesActualesDiv = document.querySelector(".ordenesActuales");
  const totalElement       = document.getElementById("total");
  const pedidoInput        = document.getElementById("pedidoInput");
  const ordenActualList    = document.getElementById("ordenesActuales");
  const realizarPedidoBtn  = document.getElementById("realizarPedido");
  const modal              = document.getElementById("modal");
  const closeModalBtn      = document.getElementById("close-modal");
  const formCliente        = document.getElementById("formCliente");
  const LogOutBtn          = document.getElementById("logout");
  const AdminBtn          = document.getElementById("admin");

  asideElement.style.display       = "none";
  ordenesActualesDiv.style.display = "none";

  const ordenes = {};
  let   total   = 0;
  let   catActual = "";


  /* 3️⃣  Carga del menú --------------------- */
  fetch(URL_MENU)
    .then(r => r.json())
    .then(({data}) => dibujarProductos(data))
    .catch(err => console.error("Error al obtener menú:", err));

  AdminBtn.addEventListener("click", () => {
    try {
      const pedidos = await fetchAutenticado('/pedidos');
      window.location.href = "/pedidos";
    } catch (error) {
      console.log("No se pudieron cargar los pedidos", error);
    }
  });

  LogOutBtn.addEventListener("click", () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "";
    });
  /* 4️⃣  Render de productos --------------- */
  function dibujarProductos(productos) {
    const container = itemsMenuContainer;
    container.innerHTML = "";
    productos.forEach(prod => {
      if (catActual !== prod.categoria) {
        const h2 = document.createElement("h2");
        h2.textContent = prod.categoria + "s";
        container.appendChild(h2);

        const section = document.createElement("section");
        section.classList.add(prod.categoria + "s");

        productos.forEach(p => {
          if (p.categoria === prod.categoria) {
            const btn = document.createElement("button");
            btn.innerHTML = `
              <div>
                <img src="/static/${p.imagen}" alt="${p.nombre}">
                <div>
                  <p>${p.nombre}</p>
                  <span>$${p.precio}</span>
                </div>
              </div>
              <span>${p.descripcion}</span>
            `;
            btn.addEventListener("click", () => agregarAlCarrito(p, btn));
            section.appendChild(btn);
          }
        });

        container.appendChild(section);
        catActual = prod.categoria;
      }
    });
  }

  /* 5️⃣  Lógica de carrito ------------------ */
  function agregarAlCarrito(prod, button) {
    const itemName  = prod.nombre;
    const itemPrice = prod.precio;

    if (ordenes[itemName]) {
      ordenes[itemName].cantidad++;
      actualizarFila(itemName);
    } else {
      crearFila(itemName, itemPrice);
    }

    total += itemPrice;
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
    actualizarPedido();

    asideElement.style.display = "block";
    ordenesActualesDiv.style.display = "block";
  }

  function crearFila(nombre, precio) {
    const li = document.createElement("li");
    li.innerHTML = `
      ${nombre} <span class="cantidad">x1</span> - <span class="precio">$${precio.toFixed(2)}</span>
      <button class="borrar">-</button>
    `;
    ordenActualList.appendChild(li);

    ordenes[nombre] = { cantidad: 1, precioUnitario: precio, elementoLi: li };

    li.querySelector(".borrar").addEventListener("click", () => {
      total -= ordenes[nombre].cantidad * precio;
      delete ordenes[nombre];
      li.remove();
      totalElement.textContent = `Total: $${total.toFixed(2)}`;
      actualizarPedido();

      if (Object.keys(ordenes).length === 0) {
        asideElement.style.display = "none";
        ordenesActualesDiv.style.display = "none";
      }
    });
  }

  function actualizarFila(nombre) {
    const fila = ordenes[nombre].elementoLi;
    fila.querySelector(".cantidad").textContent = `x${ordenes[nombre].cantidad}`;
    fila.querySelector(".precio").textContent =
      `$${(ordenes[nombre].cantidad * ordenes[nombre].precioUnitario).toFixed(2)}`;
  }

  function actualizarPedido() {
    const pedidoTxt = Object.keys(ordenes).map(n => {
      const o = ordenes[n];
      return `${n} x${o.cantidad} - $${(o.cantidad * o.precioUnitario).toFixed(2)}`;
    }).join(", ");
    pedidoInput.value = pedidoTxt;
  }


  /* 6️⃣  Modal & envío ---------------------- */
  realizarPedidoBtn.addEventListener("click", e => {
    e.preventDefault();
    actualizarPedido();
    modal.style.display = "block";
  });
  closeModalBtn.addEventListener("click", () => modal.style.display = "none");

  formCliente.addEventListener("submit", async e => {
    e.preventDefault();

    const pedido = {
      nombreCliente   : document.getElementById("nombre").value.trim(),
      telefonoCliente : document.getElementById("telefono").value.trim(),
      direccionCliente: document.getElementById("direccion").value.trim(),
      listaProductos  : Object.keys(ordenes).map(n => ({
        nombre       : n,
        cantidad     : ordenes[n].cantidad,
        precioUnitario: ordenes[n].precioUnitario
      }))
    };
    pedido.valorTotal = pedido.listaProductos
                         .reduce((s,p) => s + p.precioUnitario * p.cantidad, 0);

    /* --- llamada a Django --- */
    try {
      const resp = await fetch(URL_PEDIDOS, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(pedido)
      });
      if (!resp.ok) throw new Error("Error HTTP " + resp.status);
    } catch (err) {
      alert("Hubo un problema al registrar el pedido 😥");
      console.error(err);
      return;
    }

    /* 7️⃣  Limpieza & feedback --------------- */
    modal.style.display = "none";
    alert("¡Pedido enviado con éxito!");

    ordenActualList.innerHTML = "";
    Object.keys(ordenes).forEach(k => delete ordenes[k]);
    total = 0;
    totalElement.textContent = "Total: $0";
    pedidoInput.value = "";
    asideElement.style.display = "none";
    ordenesActualesDiv.style.display = "none";
  });
  async function fetchAutenticado(url, options = {}) {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      window.location.href = '/';
      throw new Error('Debes iniciar sesión para acceder a esta sección');
    }
  
    const config = {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };
      try {
        const response = await fetch(url, config);
  
        if (response.status === 401) {
          await refrescarToken(); // Intentar renovar el token
          return fetchAutenticado(url, options); // Reintentar la solicitud
        }
    
        if (!response.ok) throw new Error('Error en la solicitud');
        return await response.json();
    
      } catch (error) {
        console.error('Error:', error);
        if (error.message.includes('autenticación')) {
          window.location.href = '/login/'; // Redirigir si falla la autenticación
        }
        throw error;
      }
    }
    
    async function refrescarToken() {
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await fetch('/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken })
      });
    
      if (!response.ok) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw new Error('Error al refrescar token');
      }
    
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
    }
};
