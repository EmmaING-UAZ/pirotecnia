document.addEventListener('DOMContentLoaded', () => {
    const cart = []; // Almacenamiento temporal, luego se usará localStorage

    // Función para añadir al carrito
    function addToCart(productId, productName, productPrice) {
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ id: productId, name: productName, price: parseFloat(productPrice), quantity: 1 });
        }
        updateCartDisplay(); // Actualizar visualización del carrito (placeholder)
        console.log(cart); // Para depuración
        alert(`${productName} añadido al carrito!`);
    }

    // Función para actualizar la visualización del carrito (muy básica por ahora)
    function updateCartDisplay() {
        // Esta función se expandirá para actualizar el DOM del carrito
        // Por ejemplo, un contador de items en el header
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        console.log(`Total items in cart: ${totalItems}`);
        // Aquí se podría actualizar un elemento del DOM:
        // const cartCounterElement = document.getElementById('cart-item-count');
        // if (cartCounterElement) cartCounterElement.textContent = totalItems;
    }

    // Event listeners para botones "Añadir al carrito" en la página de catálogo
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            const productName = e.target.dataset.name;
            const productPrice = e.target.dataset.price;
            addToCart(productId, productName, productPrice);
        });
    });

    // Event listener para el botón "Añadir al carrito" dentro del modal
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            const productName = e.target.dataset.name;
            const productPrice = e.target.dataset.price;
            addToCart(productId, productName, productPrice);
            // Opcionalmente, cerrar el modal después de añadir
            // document.getElementById('product-modal').classList.add('hidden');
        });
    }

    // Inicializar la visualización del carrito al cargar la página
    updateCartDisplay();
});
