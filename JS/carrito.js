/*----- Lista de productos -----*/
let productos = [
    { nombre: "Lemon Pie", precio: 7000, stock: 2 },
    { nombre: "Torta Brownie", precio: 7000, stock: 2 },
    { nombre: "Chocotorta", precio: 7000, stock: 2 },
    { nombre: "Tiramisú", precio: 7000, stock: 2 },
    { nombre: "Red Velvet", precio: 7500, stock: 2 },
    { nombre: "Matilda", precio: 7500, stock: 2 },
    { nombre: "Choco Carrot Cake", precio: 7500, stock: 2 },
    { nombre: "Cookie Monster", precio: 3200, stock: 6 },
    { nombre: "Cookie Classic Bear", precio: 2700, stock: 6 },
    { nombre: "Cookie M&M", precio: 3200, stock: 6 },
    { nombre: "Cookie Kinder", precio: 3200, stock: 6 },
    { nombre: "Brookie", precio: 2700, stock: 6 },
    { nombre: "Brownie", precio: 2000, stock: 6 },
    { nombre: "Chipá x 8 unid", precio: 3600, stock: 6 },
    { nombre: "Tostado x 3 unid", precio: 4500, stock: 6 }
];

/* ----- carrito -----*/
let carrito = []; 
const CLAVE_CARRITO = "carrito_reposteria"; 

function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function cargarCarrito() {
    let guardado = localStorage.getItem(CLAVE_CARRITO);
    if (guardado) {
        carrito = JSON.parse(guardado);
        
        for (let item of carrito) {
            let prodOriginal = productos.find(p => p.nombre === item.nombre);
            if (prodOriginal) {
                prodOriginal.stock -= item.cantidad;
            }
        }
    }
}

function agregarProducto(producto) {
    //validación de stock
    if (producto.stock <= 0) {
        alert("¡Lo sentimos! No queda más stock de: " + producto.nombre);
        return;
    }

    let itemExistente = carrito.find(item => item.nombre === producto.nombre);
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }

    producto.stock -= 1;
    console.log(producto.nombre + " agregado. Quedan: " + producto.stock);
    actualizarCarrito();
}

function calcularTotal() {
    let total = 0;
    for (let item of carrito) {
        total += (item.precio * item.cantidad);
    }
    return total;
}

function calcularCantidadTotal() {
    let cuenta = 0;
    for (let item of carrito) {
        cuenta += item.cantidad;
    }
    return cuenta;
}

function mostrarCarrito() {
    console.log("Productos del carrito:");
    for (let item of carrito) {
        console.log(item.nombre + " (x" + item.cantidad + ") - $" + (item.precio * item.cantidad));
    }
}

/* -------- Funciones para interactuar con la página -------- */

function conectarBotonesCatalogo() {
    let botones = document.querySelectorAll(".btn-agregar");
    for (let boton of botones) {
        boton.addEventListener("click", function () {
            let nombreAtributo = boton.getAttribute("data-nombre");
            let productoEncontrado = productos.find(p => p.nombre === nombreAtributo);
            
            if (productoEncontrado) {
                agregarProducto(productoEncontrado);
            }
        });
    }
}

function cambiarCantidad(indice, cambio) {
    let item = carrito[indice];
    let prodOriginal = productos.find(p => p.nombre === item.nombre);

    if (cambio === 1) {
        if (prodOriginal && prodOriginal.stock <= 0) {
            alert("No hay más unidades disponibles de este producto.");
            return;
        }
        item.cantidad += 1;
        if (prodOriginal) prodOriginal.stock -= 1;
    } else if (cambio === -1) {
        item.cantidad -= 1;
        if (prodOriginal) prodOriginal.stock += 1;
        
        if (item.cantidad <= 0) {
            carrito.splice(indice, 1);
        }
    }
    actualizarCarrito();
}

function quitarProducto(indice) {
    let item = carrito[indice];
    let prodOriginal = productos.find(p => p.nombre === item.nombre);
    
    if (prodOriginal) {
        prodOriginal.stock += item.cantidad;
    }
    
    carrito.splice(indice, 1);
    actualizarCarrito();
}

function vaciarCarrito() {
    for (let item of carrito) {
        let prodOriginal = productos.find(p => p.nombre === item.nombre);
        if (prodOriginal) {
            prodOriginal.stock += item.cantidad;
        }
    }

    carrito = [];
    actualizarCarrito();
}

function actualizarCarrito() {
    let listaCarrito = document.getElementById("items-carrito");
    let totalTexto = document.getElementById("total-carrito");
    let cantidadTexto = document.getElementById("cantidad-carrito");
    
    if (!listaCarrito || !totalTexto || !cantidadTexto) return;
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<li class='carrito-vacio'>Tu carrito está vacío.</li>";
    } else {
        for (let i = 0; i < carrito.length; i++) {
            let item = carrito[i];
            let elementoLi = document.createElement("li");
            elementoLi.className = "carrito-item";
            
            elementoLi.innerHTML = `
                <div class="carrito-item-detalles">
                    <span>${item.nombre}</span><br>
                    <small>${item.precio} c/u</small>
                </div>
                <div class="carrito-item-acciones">
                    <button class="btn-control-cantidad btn-menos" data-indice="${i}">-</button>
                    <span class="item-cantidad-texto">${item.cantidad}</span>
                    <button class="btn-control-cantidad btn-mas" data-indice="${i}">+</button>
                    <strong class="item-subtotal-texto">${item.precio * item.cantidad}</strong>
                    <button class="btn-quitar" data-indice="${i}">✕</button>
                </div>
            `;
            listaCarrito.appendChild(elementoLi);
        }

        let botonesMas = document.querySelectorAll(".btn-mas");
        for (let boton of botonesMas) {
            boton.addEventListener("click", function () {
                cambiarCantidad(parseInt(boton.getAttribute("data-indice")), 1);
            });
        }

        let botonesMenos = document.querySelectorAll(".btn-menos");
        for (let boton of botonesMenos) {
            boton.addEventListener("click", function () {
                cambiarCantidad(parseInt(boton.getAttribute("data-indice")), -1);
            });
        }

        let botonesQuitar = document.querySelectorAll(".btn-quitar");
        for (let boton of botonesQuitar) {
            boton.addEventListener("click", function () {
                quitarProducto(parseInt(boton.getAttribute("data-indice")));
            });
        }
    }
    totalTexto.textContent = "$" + calcularTotal();
    cantidadTexto.textContent = calcularCantidadTotal();
    guardarCarrito();
    mostrarCarrito();
}

/* ------- Pago (Simulador de desvío a Mercado Pago) ------ */
function finalizarCompra() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let total = calcularTotal();
    console.log("Iniciando desvío controlado de pasarela de pago...");
    
    let confirmar = confirm("Vas a ser redirigido a Mercado Pago para abonar $" + total + ".\n\n¿Deseas continuar?");
    
    if (confirmar) {
        carrito = [];
        localStorage.removeItem(CLAVE_CARRITO);
        window.location.href = "https://mercadopago.com.ar";
    }
}

/* ---------- Arranque ----------- */
document.addEventListener("DOMContentLoaded", function () {
    cargarCarrito();
    conectarBotonesCatalogo();
    actualizarCarrito();

    let botonVaciar = document.getElementById("btn-vaciar");
    let botonPagar = document.getElementById("btn-pagar");
    let ventana = document.getElementById("ventana-carrito");
    let btnAbrir = document.getElementById("btn-abrir-carrito");
    let btnCerrar = document.getElementById("btn-cerrar-carrito");

    if (botonVaciar) botonVaciar.addEventListener("click", vaciarCarrito);
    if (botonPagar) botonPagar.addEventListener("click", finalizarCompra);

    if (btnAbrir) {
        btnAbrir.addEventListener("click", function(evento) {
            evento.preventDefault();
            ventana.style.display = "flex"; 
        });
    }

    if (btnCerrar) {
        btnCerrar.addEventListener("click", function(evento) {
            evento.preventDefault();
            ventana.style.display = "none";
        });
    }

    if (ventana) {
        ventana.addEventListener("click", function(evento) {
            if (evento.target === ventana) {
                ventana.style.display = "none";
            }
        });
    }
});
