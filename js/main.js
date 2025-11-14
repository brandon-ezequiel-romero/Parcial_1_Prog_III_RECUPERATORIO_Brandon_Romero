//Array de productos
const productos = [
    { id: 1, nombre: "arandano", precio: 2500, img: "img/arandano.jpg" },
    { id: 2, nombre: "banana", precio: 2000, img: "img/banana.jpg" },
    { id: 3, nombre: "frambuesa", precio: 1000, img: "img/frambuesa.png" },
    { id: 4, nombre: "frutilla", precio: 800, img: "img/frutilla.jpg" },
    { id: 5, nombre: "kiwi", precio: 1000, img: "img/kiwi.jpg" },
    { id: 6, nombre: "mandarina", precio: 950, img: "img/mandarina.jpg" },
    { id: 7, nombre: "manzana", precio: 1200, img: "img/manzana.jpg" },
    { id: 8, nombre: "naranja", precio: 4000, img: "img/naranja.jpg" },
    { id: 9, nombre: "pera", precio: 5500, img: "img/pera.jpg" },
    { id: 10, nombre: "anana", precio: 1200, img: "img/anana.jpg" },
    { id: 11, nombre: "pomelo amarillo", precio: 1100, img: "img/pomelo-amarillo.jpg" },
    { id: 12, nombre: "pomelo rojo", precio: 700, img: "img/pomelo-rojo.jpg" },
    { id: 13, nombre: "sandia", precio: 6000, img: "img/sandia.jpg" }
];

let carrito = [];

// todos los id agrupados
const contenedorProductos = document.getElementById("contenedor-productos");
const listaCarrito = document.getElementById("lista-carrito");
const inputFiltro = document.getElementById("input-filtro");
const contadorHeader = document.getElementById("contador-header");
const totalGeneral = document.getElementById("total-general");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const carritoVacio = document.getElementById("carrito-vacio");
const navAlumno = document.getElementById("nav-alumno");

// esta funcion imprime los datos del alumno. se utiliza un array para definir mis datos
// y getElementById para obtener el id y luego printearlo con innerhtml
function imprimirDatosAlumno() {
    const alumno = { dni: "44100080", nombre: "Brandon Ezequiel", apellido: "Romero" };
    console.log(`${alumno.nombre} ${alumno.apellido} - DNI: ${alumno.dni}`);
    const cont = document.getElementById("nav-alumno");
    cont.innerHTML = `${alumno.nombre} ${alumno.apellido}`;
}

//funcion init que se ejecuta al cargar la pagina. se encarga de imprimir datos del alumno,
//recuperar productos del localStorage, renderizar productos y manejar los eventListeners
function init() {
    imprimirDatosAlumno();
    recuperarCarritoLocalStorage();
    mostrarProductos(productos);
    mostrarCarrito();
    // listeners
    inputFiltro.addEventListener("input", () => manejarFiltro(inputFiltro.value));
    document.getElementById("orden-az").addEventListener("click", () => ordenarPor("az"));
    document.getElementById("orden-za").addEventListener("click", () => ordenarPor("za"));
    document.getElementById("orden-menor").addEventListener("click", () => ordenarPor("menor"));
    document.getElementById("orden-mayor").addEventListener("click", () => ordenarPor("mayor"));
    vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
}

// renderiza los productos del array agregandole los botones de cantidad + y -, precio, nombre e imagen
function mostrarProductos(lista) {
    contenedorProductos.innerHTML = "";
    lista.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card-producto";

        const img = document.createElement("img");
        img.src = prod.img;
        img.alt = prod.nombre;

        const h3 = document.createElement("h3");
        h3.textContent = prod.nombre;

        const p = document.createElement("p");
        p.textContent = `$${prod.precio}`;

        // div para el boton de cantidad
        const controles = document.createElement("div");

        // chequea si ya esta en carrito
        const itemCarrito = carrito.find(c => c.id === prod.id);
        if (itemCarrito) {
            const controls = crearControlesEnCard(prod.id, itemCarrito.cantidad);
            controles.appendChild(controls);
        } else {
            const botonAgregar = document.createElement("button");
            botonAgregar.className = "boton";
            botonAgregar.textContent = "Agregar a carrito";
            botonAgregar.addEventListener("click", () => {
                agregarAlCarrito(prod.id);
            });
            controles.appendChild(botonAgregar);
        }

        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(p);
        card.appendChild(controles);

        contenedorProductos.appendChild(card);
    });
}

//crea los controles de cantidad + y - que van dentro de la tarjeta cuando el producto esta en carrito
function crearControlesEnCard(idProducto, cantidad) {
    const divControl = document.createElement("div");
    divControl.className = "controls";

    const botonMenos = document.createElement("button");
    botonMenos.className = "control-boton";
    botonMenos.textContent = "-";
    botonMenos.addEventListener("click", () => {
        actualizarCantidadEnCarrito(idProducto, -1);
    });

    const spanCantidad = document.createElement("span");
    spanCantidad.textContent = cantidad;

    const botonMas = document.createElement("button");
    botonMas.className = "control-boton";
    botonMas.textContent = "+";
    botonMas.addEventListener("click", () => {
        actualizarCantidadEnCarrito(idProducto, +1);
    });

    divControl.appendChild(botonMenos);
    divControl.appendChild(spanCantidad);
    divControl.appendChild(botonMas);

    return divControl;
}

// esta funcion filtra los productos segun el texto ingresado
// aplica filter() sobre productos y luego vuelve a renderizarlo con mostrarProductos()
function manejarFiltro(e) {
    filtrado = productos.filter(p => p.nombre.includes(e));
    mostrarProductos(filtrado);
}

// esta funcion agrega una fruta al carrito segun su id
// utiliza find() para localizar el producto y luego lo agrega en el array carrito
// se printea en la consola con console.log
function agregarAlCarrito(id) {
    const item = carrito.find(it => it.id === id);
    if (item) {
        item.cantidad++;
    }
    else {
        carrito.push({ id, cantidad: 1 });
        console.log("Carrito:", carrito);
    }
    guardarCarritoLocalStorage();
    // render de nuevo de productos para que cambien botones a controles
    mostrarProductos(productos);
    mostrarCarrito();
}

// renderiza todo el contenido del carrito en el DOM incluyendo producto, precio, cantidad, botones de eliminar y + y -
function mostrarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        carritoVacio.classList.remove("vacio");
    } else {
        carritoVacio.classList.add("vacio");
    }

    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);
        const li = document.createElement("li");
        li.className = "bloque-item";

        const p = document.createElement("p");
        p.className = "nombre-item";
        p.textContent = `${producto.nombre} - $${producto.precio}`;

        const controls = document.createElement("div");

        const botonMenos = document.createElement("button");
        botonMenos.textContent = "-";
        botonMenos.className = "control-btn";
        botonMenos.addEventListener("click", () => {
            actualizarCantidadEnCarrito(item.id, -1);
        });

        const spanCant = document.createElement("span");
        spanCant.textContent = item.cantidad;

        const botonMas = document.createElement("button");
        botonMas.textContent = "+";
        botonMas.className = "control-btn";
        botonMas.addEventListener("click", () => {
            actualizarCantidadEnCarrito(item.id, +1);
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "boton-eliminar";
        botonEliminar.addEventListener("click", () => {
            eliminarProducto(item.id);
        });

        controls.appendChild(botonMenos);
        controls.appendChild(spanCant);
        controls.appendChild(botonMas);
        controls.appendChild(botonEliminar);

        // subtotal por item (precio * cantidad)
        const subtotal = document.createElement("div");
        subtotal.textContent = `Subtotal: $${producto.precio * item.cantidad}`;
        li.appendChild(p);
        li.appendChild(controls);
        li.appendChild(subtotal);

        listaCarrito.appendChild(li);
    });

    actualizarContadoresYTotales();
}

//elimina por completo del carrito segun su id
function eliminarProducto(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarritoLocalStorage();
    mostrarProductos(productos);
    mostrarCarrito();
}

// esta funcion se encarga de guardar los items del carrito en el localStorage y en formato json con json.stringify()
function guardarCarritoLocalStorage() {
    localStorage.setItem("miCarrito", JSON.stringify(carrito));
}

// esta funcion recupera los datos del carrito guardados en localStorage y los asigna al array carrito para restaurarlo
function recuperarCarritoLocalStorage() {
    const datos = localStorage.getItem("miCarrito");
    if (datos) {
        carrito = JSON.parse(datos) || [];
    } else {
        carrito = [];
    }
}

//actualiza el contador de productos
function actualizarCantidadEnCarrito(id, cant) {
    const item = carrito.find(it => it.id === id);
    if (!item && cant > 0) {
        carrito.push({ id, cantidad: cant });
    } else if (item) {
        item.cantidad += cant;
        if (item.cantidad <= 0) {
            // si llega a 0 se remueve
            carrito = carrito.filter(it => it.id !== id);
        }
    }
    guardarCarritoLocalStorage();
    mostrarProductos(productos);
    mostrarCarrito();
}

// actualiza el total del carrito
function actualizarContadoresYTotales() {
    // contador header = suma de cantidades
    const cantidadTotal = carrito.reduce((acc, cur) => acc + cur.cantidad, 0);
    contadorHeader.textContent = cantidadTotal;

    // total general = suma de precio * cantidad
    const total = carrito.reduce((acc, cur) => {
        const prod = productos.find(p => p.id === cur.id);
        return acc + (prod.precio * cur.cantidad);
    }, 0);
    totalGeneral.textContent = `$${total}`;

    // ocultar o mostrar resumen si no hay productos
    if (carrito.length === 0) {
        totalGeneral.textContent = `$0`;
    }
}

//ordena por a-z, z-a, menor y mayor
function ordenarPor(tipo) {
    switch (tipo) {
        case "az":
            productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case "za":
            productos.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
        case "menor":
            productos.sort((a, b) => a.precio - b.precio);
            break;
        case "mayor":
            productos.sort((a, b) => b.precio - a.precio);
            break;
    }
    mostrarProductos(productos);
}

//vacia el carrito, guarda los cambios en el localstorage y vuelve a renderizar los productos
function vaciarCarrito() {
    carrito = [];
    guardarCarritoLocalStorage();
    mostrarProductos(productos);
    mostrarCarrito();
}

init();