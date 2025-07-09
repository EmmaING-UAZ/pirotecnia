document.addEventListener('DOMContentLoaded', () => {
    const productsGridContainer = document.getElementById('products-grid-container');
    const cartButton = document.getElementById('cart-button');
    const sideCart = document.getElementById('side-cart');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartCount = document.getElementById('cart-count');
    const cartOverlay = document.getElementById('cart-overlay');
    const exploreCatalogBtn = document.getElementById('explore-catalog-btn');
    const productsSection = document.getElementById('products');
    const ageGateModal = document.getElementById('age-gate-modal');
    const confirmAgeBtn = document.getElementById('confirm-age-btn');

    // Datos de productos (JSON simulado)
    const products = [
        { id: 1, name: 'Bengala "Chispitas Felices"', price: 5.99, image: 'https://placehold.co/300x200/FF3333/FFFFFF/png?text=Bengala', category: 'Juguetería' },
        { id: 2, name: 'Petardo "Trueno Lejano"', price: 12.50, image: 'https://placehold.co/300x200/FFD700/000000/png?text=Petardo', category: 'Juguetería' },
        { id: 3, name: 'Batería "Noche Estrellada" 16T', price: 45.00, image: 'https://placehold.co/300x200/0000FF/FFFFFF/png?text=Batería+16T', category: 'Cakes' },
        { id: 4, name: 'Fuente "Volcán Dorado"', price: 22.99, image: 'https://placehold.co/300x200/FF69B4/000000/png?text=Fuente+Dorado', category: 'Pirotecnia Fría' },
        { id: 5, name: 'Humo Revelación Azul', price: 18.75, image: 'https://placehold.co/300x200/87CEEB/FFFFFF/png?text=Humo+Azul', category: 'Revelaciones de Género' },
        { id: 6, name: 'Humo Revelación Rosa', price: 18.75, image: 'https://placehold.co/300x200/FFC0CB/000000/png?text=Humo+Rosa', category: 'Revelaciones de Género' },
        { id: 7, name: 'Cake Profesional "Apocalipsis Show" 100T', price: 199.99, image: 'https://placehold.co/300x200/800080/FFFFFF/png?text=Cake+Pro+100T', category: 'Pirotecnia Profesional' },
        { id: 8, name: 'Chispero LED (Pack 10)', price: 15.00, image: 'https://placehold.co/300x200/FFFFFF/000000/png?text=Chispero+LED', category: 'Pirotecnia Fría' },
    ];

    let cart = [];

    // Cargar productos en la galería
    function renderProducts() {
        if (!productsGridContainer) return;
        productsGridContainer.innerHTML = ''; // Limpiar antes de renderizar
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <div>
                        <h3>${product.name}</h3>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        🛒 Agregar al Carrito
                    </button>
                </div>
            `;
            productsGridContainer.appendChild(productCard);

            // Animación fade-in para cada tarjeta
            productCard.classList.add('fade-in');
        });

        // Añadir event listeners a los botones "Agregar al carrito"
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                addToCart(id);
                // Animación de bounce en el botón
                e.target.classList.add('product-bounce');
                setTimeout(() => e.target.classList.remove('product-bounce'), 600);
            });
        });
    }

    // Cargar carrito desde localStorage
    function loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem('emmaFireworksCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            updateCartView();
        }
    }

    // Guardar carrito en localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('emmaFireworksCart', JSON.stringify(cart));
    }

    // Agregar producto al carrito
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartView();
        saveCartToLocalStorage();

        // Animar ícono del carrito
        if (cartButton) {
            cartButton.classList.add('product-bounce');
            setTimeout(() => cartButton.classList.remove('product-bounce'), 600);
        }
    }

    // Actualizar la vista del carrito
    function updateCartView() {
        if (!cartItemsList || !cartTotalAmount || !cartCount) return;

        cartItemsList.innerHTML = ''; // Limpiar vista actual
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                const itemSubtotal = item.price * item.quantity;
                total += itemSubtotal;
                totalItems += item.quantity;

                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Precio: $${item.price.toFixed(2)}</p>
                        <p>Subtotal: $${itemSubtotal.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-change" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-change" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <button class="cart-item-remove-btn" data-id="${item.id}">Eliminar</button>
                `;
                cartItemsList.appendChild(cartItemElement);
            });
        }

        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = totalItems;

        // Event listeners para botones de cantidad y eliminar en el carrito
        document.querySelectorAll('.quantity-change').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const action = e.target.dataset.action;
                changeQuantity(id, action);
            });
        });

        document.querySelectorAll('.cart-item-remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                removeFromCart(id);
            });
        });
    }

    // Cambiar cantidad de un item en el carrito
    function changeQuantity(productId, action) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) return;

        if (action === 'increase') {
            cart[itemIndex].quantity++;
        } else if (action === 'decrease') {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1); // Eliminar si la cantidad es 0 o menos
            }
        }
        updateCartView();
        saveCartToLocalStorage();
    }

    // Eliminar producto del carrito
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartView();
        saveCartToLocalStorage();
    }

    // Abrir/Cerrar carrito
    function toggleCart() {
        if (sideCart && cartOverlay) {
            sideCart.classList.toggle('open');
            cartOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Evitar scroll del body
        }
    }

    // Event Listeners
    if (cartButton) cartButton.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart); // Cerrar al hacer clic fuera

    if (exploreCatalogBtn && productsSection) {
        exploreCatalogBtn.addEventListener('click', () => {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Sección de Categorías - Botones "Ver Productos" (simulado, lleva a la sección de productos)
    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', () => {
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // Inicialización
    renderProducts();
    loadCartFromLocalStorage();

    // Aplicar animación fade-in general al cargar la página (al body o main)
    // Se puede hacer con CSS directamente en el body o un wrapper principal si se desea.
    // Para un efecto escalonado, se puede aplicar a secciones.
    // Aquí se aplica a las secciones principales para demostración.
    const sectionsToAnimate = document.querySelectorAll('.hero, .categories-section, .products-section');
    function applyFadeInAnimations() {
        sectionsToAnimate.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.2}s`; // Retraso escalonado
            section.classList.add('fade-in');
        });
    }

    // Lógica del Modal de Confirmación de Edad
    function handleAgeGate() {
        if (!ageGateModal || !confirmAgeBtn) return;

        const ageConfirmed = localStorage.getItem('emmaFireworksAgeConfirmed');

        if (ageConfirmed === 'true') {
            ageGateModal.classList.remove('active');
            document.body.classList.remove('modal-open');
            applyFadeInAnimations(); // Aplicar animaciones si ya está confirmado
            return;
        }

        // Si no está confirmado, mostrar el modal
        ageGateModal.classList.add('active');
        document.body.classList.add('modal-open');

        confirmAgeBtn.addEventListener('click', () => {
            localStorage.setItem('emmaFireworksAgeConfirmed', 'true');
            ageGateModal.classList.remove('active');
            document.body.classList.remove('modal-open');
            applyFadeInAnimations(); // Aplicar animaciones después de confirmar
        });
    }

    // Inicialización
    handleAgeGate(); // Manejar primero el age gate
    renderProducts();
    loadCartFromLocalStorage();
    // Las animaciones fade-in se llaman desde handleAgeGate ahora
});
