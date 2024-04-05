document.addEventListener('DOMContentLoaded', function () {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const productosContainer = document.getElementById('productos');
            data.forEach(producto => {
                const cardColumn = document.createElement('div');
                cardColumn.classList.add('col-md-3');

                const card = document.createElement('div');
                card.classList.add('card');

                const imagen = document.createElement('img');
                imagen.src = producto.imagen;
                imagen.classList.add('card-img-top');
                card.appendChild(imagen);

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
                cardBody.innerHTML = `
                    <h3>${producto.nombre}</h3>
                    <p>Precio: $${producto.precio}</p>
                    <button class="agregar-carrito btn btn-primary" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al carrito</button>
                `;

                card.appendChild(cardBody);

                cardColumn.appendChild(card);
                productosContainer.appendChild(cardColumn);
            });

            const botonesAgregarCarrito = document.querySelectorAll('.agregar-carrito');
            botonesAgregarCarrito.forEach(boton => {
                boton.addEventListener('click', agregarAlCarrito);
            });
        })
        .catch(error => console.error('Error cargando los productos:', error));


    const botonVerCarrito = document.getElementById('ver-carrito');
    botonVerCarrito.addEventListener('click', function () {
        const carritoContainer = document.getElementById('carrito');
        carritoContainer.style.display = 'block';
    });

    const botonVaciarCarrito = document.getElementById('vaciar-carrito');
    botonVaciarCarrito.addEventListener('click', vaciarCarrito);

    let total = 0;
    let carrito = [];

    // agrego al carrito
    function agregarAlCarrito(event) {
        const nombre = event.target.getAttribute('data-nombre');
        const precio = parseFloat(event.target.getAttribute('data-precio'));

        const index = carrito.findIndex(item => item.nombre === nombre);
        if (index !== -1) {
            carrito[index].cantidad++;
        } else {
            carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
        }

        total += precio;

        mostrarCarrito();

        const mensaje = `${nombre} agregado al carrito.`;
        mostrarPopUp(mensaje);
    }

    // pop-up con sweet
    function mostrarPopUp(mensaje) {
        Swal.fire({
            title: '¡Producto agregado!',
            text: mensaje,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
        });
    }

    function mostrarCarrito() {
        const carritoContainer = document.getElementById('carrito-items');
        carritoContainer.innerHTML = '';

        carrito.forEach((item, index) => {
            const itemElement = document.createElement('div');
            if (item.cantidad > 1) {
                itemElement.textContent = `${item.nombre} (${item.cantidad}): $${item.precio * item.cantidad}`;
            } else {
                itemElement.textContent = `${item.nombre}: $${item.precio}`;
            }

            // botón de eliminar
            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.classList.add('btn', 'btn-danger', 'btn-sm', 'ml-2');
            botonEliminar.addEventListener('click', () => eliminarProducto(index));

            itemElement.appendChild(botonEliminar);

            carritoContainer.appendChild(itemElement);
        });

        const totalElement = document.getElementById('total');
        totalElement.textContent = total.toFixed(2);
    }

    // funcion para eliminar un producto específico
    function eliminarProducto(index) {
        const productoEliminado = carrito.splice(index, 1)[0];
        total -= productoEliminado.precio * productoEliminado.cantidad;
        mostrarCarrito();
    }

    // vacio el carrito
    function vaciarCarrito() {
        total = 0;
        carrito = [];
        mostrarCarrito();
        const carritoContainer = document.getElementById('carrito');
        carritoContainer.style.display = 'none';
    }


    const botonComprar = document.getElementById('comprar');
    const mensajeCompra = document.getElementById('mensaje-compra');

    botonComprar.addEventListener('click', realizarCompra);


    function realizarCompra() {
        // calculo el precio total
        let precioTotal = 0;
        carrito.forEach(item => {
            precioTotal += item.precio * item.cantidad;
        });

        // mensaje de la lista de productos y del precio total
        let mensaje = '<h3>Productos en tu carrito:</h3>';
        carrito.forEach(item => {
            mensaje += `<p>${item.nombre} (${item.cantidad}): $${item.precio * item.cantidad}</p>`;
        });
        mensaje += `<p><strong>Total a pagar: $${precioTotal.toFixed(2)}</strong></p>`;

        // mensaje de compra
        mensajeCompra.innerHTML = mensaje;
        mensajeCompra.style.display = 'block';

        // vacio el carrito después de la compra
        vaciarCarrito();

        // oculto el mensaje de la compra para que no quede
        setTimeout(() => {
            mensajeCompra.style.display = 'none';
        }, 3000);
    }

});
