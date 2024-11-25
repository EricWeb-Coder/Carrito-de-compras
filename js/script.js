var carrito = [];
var productosCargados = [];

async function cargarProductos(){
    const response = await fetch('productos.json');
    productosCargados = await response.json();
    mostrarProductos(productosCargados);
}

function mostrarProductos(productos){
    const container = document.getElementById('productos-container');
    container.innerHTML = '';
    productos.forEach(
        producto => {
            const productHTML = `
            <figure class="wow flipInY" data-wow-delayt=".5s">
                <img src="${producto.imagen}">
                <figcaption>${producto.nombre}</figcaption>
                <p>${producto.descripcion}<p>
                <p class="precio">$${producto.precio}</p>
                <div class="productos-btns">
                    <button class="btn-s" onclick="actualizarCantidad(${producto.id},-1)"> - </button>
                    <input type="number" value="1" id="cantidad-${producto.id}">
                    <button class="btn-s" onclick="actualizarCantidad(${producto.id},1)"> + </button>
                    <button class="btn-s-s" onclick="agregarAlCarrito(${producto.id})"> Agregar al Carrito </button>
                </div>
            </figure>   
            `;
            container.innerHTML += productHTML;
        }
    );
}

function actualizarCantidad (idProducto, cambio){
    const cantidadInput = document.getElementById(`cantidad-${idProducto}`);
    let cantidad = parseInt(cantidadInput.value);
    cantidad = Math.max(1,cantidad+cambio);
    cantidadInput.value = cantidad;
}


function cambiarCantidad(index,cambio){
    carrito[index].cantidad = Math.max(1, carrito[index].cantidad+cambio);
    mostrarCarrito();
}

function ordenarProductos (){ 
    const criterio = document.getElementById('ordenarProducto').value;
    let productosOrdenados = [...productosCargados];
    if (criterio ==='menor-mayor'){
        productosOrdenados.sort((a,b)=>a.precio - b.precio);
    }else if(criterio ==='mayor-menor'){
        productosOrdenados.sort((a,b)=>b.precio - a.precio);
    }else if(criterio==='alfabetico'){
        productosOrdenados.sort((a,b)=>a.nombre.localeCompare(b.nombre));
    }
    mostrarProductos(productosOrdenados);
    }

    function mostrarCarrito(){
        const carritoItems = document.getElementById('carrito-items');
        carritoItems.innerHTML = '';
        if(carrito.length === 0){
            carritoItems.innerHTML= '<p>Tu carrito esta vacio.</p>';
        }else{
            carrito.forEach((producto,index) => {
                carritoItems.innerHTML += `
                <div class="productos-carrito">
                    <img src="${producto.imagen}" >
                    <div class="acomodar">
                    <div>
                    <p>${producto.nombre}</p>
                    <p>Precio: $${producto.precio}</p>
                    <button onclick="cambiarCantidad(${index},-1)"> - </button>
                    <input type="number" value=${producto.cantidad} min="1">
                    <button onclick="cambiarCantidad(${index},1)"> + </button>
                    <span>Total: $${producto.precio * producto.cantidad}</span>
                    <button onclick="eliminarDelCarrito(${index})" > Eliminar </button>
                    </div>
                    </div>
                `;
            })
        }
        localStorage.setItem('carrito',JSON.stringify(carrito));
        document.getElementById('carrito-modal').style.display='block';
    }


    
    async function agregarAlCarrito(idProducto){
        const response = await fetch('productos.json');
        const productos = await response.json();
        const productoSeleccionado = productos.find(p => p.id === idProducto);
        const cantidad = parseInt(document.getElementById(`cantidad-${idProducto}`).value);
        const productoExistente = carrito.find(p => p.id === idProducto);
        if (productoExistente){
            productoExistente.cantidad += cantidad;
        }else{ 
            const productoEnCarrito = {
                ...productoSeleccionado, cantidad
            };
            carrito.push(productoEnCarrito);
        }
        localStorage.setItem('carrito',JSON.stringify(carrito));
        mostrarCarrito();
    }


function eliminarDelCarrito(index){
    carrito.splice(index,1);
    mostrarCarrito();
}

function cerrarCarrito(){
    document.getElementById('carrito-modal').style.display = 'none';
}

function irAPago(){
    cerrarCarrito();
    var nombre = prompt('Ingresa tu nombre');
    var tarjeta = prompt('Ingresa tu numero de tarjeta');
    var total = carrito.reduce((acc,producto)=>acc + (producto.precio * producto.cantidad),0);
    alert (`Gracias ${nombre}`);
    carrito = [];
    mostrarCarrito();
}


//funcion .reduce (sustrae todos los elementos de un array (los numeros))
//funcion .local compare (compara strings(texto))



// cargar productos al iniciar la pagina
window.onload = cargarProductos;
