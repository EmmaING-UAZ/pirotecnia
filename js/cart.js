document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountDesktop = document.getElementById('cart-count-desktop');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    const checkoutButton = document.getElementById('checkout-button');

    let cart = JSON.parse(localStorage.getItem('emmaFireworksCart')) || [];

    function saveCart() {
        localStorage.setItem('emmaFireworksCart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountDesktop) cartCountDesktop.textContent = totalItems;
        if (cartCountMobile) cartCountMobile.textContent = totalItems;
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotalElement) cartTotalElement.textContent = formatCurrency(total);
        if (checkoutButton) {
            checkoutButton.disabled = cart.length === 0;
        }
    }

    function renderCartItems() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = ''; // Limpiar items actuales

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center">Tu carrito está vacío.</p>';
            updateCartTotal();
            updateCartCount();
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('flex', 'justify-between', 'items-center', 'py-3', 'border-b');
            itemElement.innerHTML = `
                <div class="flex items-center space-x-3">
                    <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                    <div>
                        <h4 class="font-semibold text-sm text-gray-800">${item.name}</h4>
                        <p class="text-xs text-gray-500">${formatCurrency(item.price)} x ${item.quantity}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="font-semibold text-sm text-gray-800">${formatCurrency(item.price * item.quantity)}</span>
                    <button data-id="${item.id}" class="remove-from-cart-btn text-red-500 hover:text-red-700" aria-label="Eliminar ${item.name} del carrito">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.502 0c-.34.055-.68.11-.1.022.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        addRemoveEventListeners();
        updateCartTotal();
        updateCartCount();
    }

    function addRemoveEventListeners() {
        const removeButtons = document.querySelectorAll('.remove-from-cart-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.currentTarget.dataset.id;
                removeItemFromCart(itemId);
            });
        });
    }

    window.addToCart = function(product, quantity = 1) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }
        saveCart();
        renderCartItems();
        // Opcional: abrir el panel del carrito al agregar un item
        // document.getElementById('cart-button-desktop').click(); // Simula click para abrir
    }

    window.updateItemQuantity = function(productId, newQuantity) {
        const itemInCart = cart.find(item => item.id === productId);
        if (itemInCart) {
            if (newQuantity > 0) {
                itemInCart.quantity = newQuantity;
            } else {
                cart = cart.filter(item => item.id !== productId);
            }
            saveCart();
            renderCartItems();
        }
    }

    function removeItemFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCartItems();
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                // Simulación de checkout
                alert(`Procesando pago por ${cartTotalElement.textContent}.\nGracias por tu compra en EmmaFireworks!`);
                cart = []; // Vaciar carrito después del "pago"
                saveCart();
                renderCartItems();
                // Podrías redirigir a una página de agradecimiento o cerrar el panel
                const closeCartButton = document.getElementById('close-cart-button');
                if(closeCartButton) closeCartButton.click();
            }
        });
    }


    // Inicializar carrito al cargar la página
    renderCartItems();
});

// Helper para formatear moneda (global o importado si se usa módulos)
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}
