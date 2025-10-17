document.addEventListener('DOMContentLoaded', () => {
    let carrito = [];
    const IMPUESTO = 0.10;

    const catalogo = document.getElementById('catalogo');
    const carritoContainer = document.getElementById('carrito-izquierda');
    const listaCarrito = document.getElementById('lista-carrito');
    const contadorCarrito = document.getElementById('contador-carrito');
    const cartIcon = document.getElementById('cart-icon');
    const cartCountBadge = document.getElementById('cart-count-badge');
    const subtotalDisplay = document.getElementById('subtotal');
    const impuestosDisplay = document.getElementById('impuestos');
    const totalFinalDisplay = document.getElementById('total-final');
    const btnVaciar = document.getElementById('btn-vaciar');

    cartIcon.addEventListener('click', () => {
        carritoContainer.classList.toggle('hidden');
    });

    catalogo.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-agregar')) {
            const productoDiv = e.target.closest('.producto');
            const stockActual = parseInt(productoDiv.getAttribute('data-stock'));
            if (stockActual <= 0) {
                alert('Producto agotado!');
                return;
            }
            const productoId = productoDiv.getAttribute('data-id');
            const productoNombre = productoDiv.querySelector('h3').textContent;
            const productoPrecio = parseFloat(productoDiv.getAttribute('data-precio'));
            agregarAlCarrito(productoId, productoNombre, productoPrecio, productoDiv);
        }
    });

    listaCarrito.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-eliminar-item')) {
            const idAEliminar = e.target.getAttribute('data-id');
            eliminarDelCarrito(idAEliminar);
        }
    });

    btnVaciar.addEventListener('click', () => {
        if (carrito.length > 0) {
            vaciarCarrito();
        } else {
            alert('El carrito ya está vacío.');
        }
    });

    function agregarAlCarrito(id, nombre, precio, productoDiv) {
        const itemExistente = carrito.find(item => item.id === id);
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            const stockOriginal = parseInt(productoDiv.getAttribute('data-stock'));
            carrito.push({ id, nombre, precio, cantidad: 1, stockOriginal: stockOriginal });
        }
        let stockVisual = parseInt(productoDiv.getAttribute('data-stock'));
        productoDiv.setAttribute('data-stock', stockVisual - 1);
        productoDiv.querySelector('.stock-info').textContent = `Stock: ${stockVisual - 1}`;
        actualizarCarritoHTML();
    }
    
    function eliminarDelCarrito(id) {
        const itemIndex = carrito.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            const item = carrito[itemIndex];
            const productoDiv = catalogo.querySelector(`.producto[data-id="${id}"]`);
            let stockVisual = parseInt(productoDiv.getAttribute('data-stock'));
            productoDiv.setAttribute('data-stock', stockVisual + item.cantidad);
            productoDiv.querySelector('.stock-info').textContent = `Stock: ${stockVisual + item.cantidad}`;
            carrito.splice(itemIndex, 1);
        }
        actualizarCarritoHTML();
    }

    function vaciarCarrito() {
        carrito.forEach(item => {
            const productoDiv = catalogo.querySelector(`.producto[data-id="${item.id}"]`);
            productoDiv.setAttribute('data-stock', item.stockOriginal);
            productoDiv.querySelector('.stock-info').textContent = `Stock: ${item.stockOriginal}`;
        });
        carrito = [];
        actualizarCarritoHTML();
    }

    function actualizarCarritoHTML() {
        listaCarrito.innerHTML = ''; 
        let subtotal = 0;
        let totalItems = 0;
        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<li>El carrito está vacío.</li>';
        } else {
            carrito.forEach(item => {
                const itemTotal = item.precio * item.cantidad;
                subtotal += itemTotal;
                totalItems += item.cantidad;
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.nombre} x${item.cantidad} - $${itemTotal.toFixed(2)}</span>
                    <button class="btn-eliminar-item" data-id="${item.id}">X</button>
                `;
                listaCarrito.appendChild(li);
            });
        }
        const impuestos = subtotal * IMPUESTO;
        const totalFinal = subtotal + impuestos;
        contadorCarrito.textContent = totalItems;
        cartCountBadge.textContent = totalItems;
        subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
        impuestosDisplay.textContent = `$${impuestos.toFixed(2)}`;
        totalFinalDisplay.textContent = `$${totalFinal.toFixed(2)}`;
    }
    
    document.querySelector('.btn-comprar').addEventListener('click', () => {
        if (carrito.length > 0) {
            alert(`¡Proceso de pago iniciado! Total: ${totalFinalDisplay.textContent}`);
            vaciarCarrito();
        } else {
            alert('Tu carrito está vacío. ¡Añade algunos juegos!');
        }
    });
});
