document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const productsGridContainer = document.getElementById('products-grid-container');
    const cartButton = document.getElementById('cart-button');
    const sideCart = document.getElementById('side-cart');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartCount = document.getElementById('cart-count');
    const cartOverlay = document.getElementById('cart-overlay');
    // const ageGateModal = document.getElementById('age-gate-modal'); // Eliminado
    // const confirmAgeBtn = document.getElementById('confirm-age-btn'); // Eliminado
    const mainHeader = document.querySelector('.main-header');
    const subNavbar = document.querySelector('.sub-navbar');
    const floatingCartBtn = document.getElementById('floating-cart-btn');
    const floatingCartCount = document.getElementById('floating-cart-count');
    const hamburgerMenuBtn = document.querySelector('.hamburger-menu-btn');
    const mobileMenuPanel = document.querySelector('.mobile-menu-panel');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');


    // --- Page Identification ---
    const currentPage = document.body.id === 'page-catalog' ? 'catalog' : 'index';

    // --- Product Data ---
    const products = [
        { id: 1, name: 'Bengala "Chispitas Felices"', price: 5.99, image: 'https://placehold.co/300x200/FF3333/FFFFFF/png?text=Bengala', category: 'Juguetería' },
        { id: 2, name: 'Petardo "Trueno Lejano"', price: 12.50, image: 'https://placehold.co/300x200/FFD700/000000/png?text=Petardo', category: 'Juguetería' },
        { id: 3, name: 'Batería "Noche Estrellada" 16T', price: 45.00, image: 'https://placehold.co/300x200/0000FF/FFFFFF/png?text=Batería+16T', category: 'Cakes' },
        { id: 4, name: 'Fuente "Volcán Dorado"', price: 22.99, image: 'https://placehold.co/300x200/FF69B4/000000/png?text=Fuente+Dorado', category: 'Pirotecnia Fría' },
        { id: 5, name: 'Humo Revelación Azul', price: 18.75, image: 'https://placehold.co/300x200/87CEEB/FFFFFF/png?text=Humo+Azul', category: 'Revelaciones de Género' },
        { id: 6, name: 'Humo Revelación Rosa', price: 18.75, image: 'https://placehold.co/300x200/FFC0CB/000000/png?text=Humo+Rosa', category: 'Revelaciones de Género' },
        { id: 7, name: 'Cake Profesional "Apocalipsis Show" 100T', price: 199.99, image: 'https://placehold.co/300x200/800080/FFFFFF/png?text=Cake+Pro+100T', category: 'Pirotecnia Profesional' },
        { id: 8, name: 'Chispero LED (Pack 10)', price: 15.00, image: 'https://placehold.co/300x200/FFFFFF/000000/png?text=Chispero+LED', category: 'Pirotecnia Fría' },
        { id: 9, name: 'Traca "Final Festivo" 20m', price: 35.50, image: 'https://placehold.co/300x200/FFA500/000000/png?text=Traca+20m', category: 'Pirotecnia Profesional' },
        { id: 10, name: 'Set Infantil "Peque Explosión"', price: 29.99, image: 'https://placehold.co/300x200/008000/FFFFFF/png?text=Set+Infantil', category: 'Juguetería' },
    ];

    // --- Cart State ---
    let cart = [];
    let currentCatalogFilter = 'all'; // Default filter for catalog page
    const recommendedProductsCount = 3;

    // --- Product Rendering Logic ---
    function renderProducts(filter = 'all', searchTerm = '') {
        if (!productsGridContainer) return;
        productsGridContainer.innerHTML = ''; // Clear previous products

        let productsToRender = [...products]; // Use a copy for manipulation

        if (currentPage === 'catalog') {
            // Apply category filter
            if (filter !== 'all') {
                productsToRender = productsToRender.filter(p => p.category === filter);
            }
            // Apply search term filter (simple name search)
            if (searchTerm.trim() !== '') {
                const lowerSearchTerm = searchTerm.trim().toLowerCase();
                productsToRender = productsToRender.filter(p => p.name.toLowerCase().includes(lowerSearchTerm));
            }
        } else if (currentPage === 'index') {
            // Display a fixed number of recommended products on the index page
            productsToRender = products.slice(0, recommendedProductsCount);
        }

        if (productsToRender.length === 0) {
            const message = currentPage === 'catalog' ? 'No hay productos que coincidan con tu búsqueda o filtro.' : 'No hay productos recomendados disponibles en este momento.';
            productsGridContainer.innerHTML = `<p class="loading-message">${message}</p>`;
            return;
        }

        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            // Note: Fade-in for individual cards can be added here if desired upon each render
            // For now, main sections fade-in, and cards appear with the section.
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
        });

        addEventListenersToCartButtons();
    }

    function addEventListenersToCartButtons() {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            if (button.dataset.listenerAttached === 'true') return; // Prevent duplicate listeners
            button.dataset.listenerAttached = 'true';
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                addToCart(id);
                e.target.classList.add('product-bounce');
                setTimeout(() => e.target.classList.remove('product-bounce'), 600);
            });
        });
    }

    // --- Cart Functionality ---
    function loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem('emmaFireworksCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
        updateCartView(); // Update view even if cart is empty (to show "empty" message)
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('emmaFireworksCart', JSON.stringify(cart));
    }

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
        if (cartButton) { // Animate cart icon
            cartButton.classList.add('product-bounce');
            setTimeout(() => cartButton.classList.remove('product-bounce'), 600);
        }
    }

    function updateCartView() {
        if (!cartItemsList || !cartTotalAmount || !cartCount) return;
        cartItemsList.innerHTML = '';
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
                    <button class="cart-item-remove-btn" data-id="${item.id}" aria-label="Eliminar producto">🗑️</button>
                `;
                cartItemsList.appendChild(cartItemElement);
            });
        }
        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = totalItems;
        if (floatingCartCount) floatingCartCount.textContent = totalItems; // Actualizar contador flotante
        addEventListenersToCartItemControls();
    }

    function addEventListenersToCartItemControls() {
        document.querySelectorAll('.quantity-change').forEach(button => {
            if (button.dataset.listenerAttached === 'true') return;
            button.dataset.listenerAttached = 'true';
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const action = e.target.dataset.action;
                changeQuantity(id, action);
            });
        });
        document.querySelectorAll('.cart-item-remove-btn').forEach(button => {
            if (button.dataset.listenerAttached === 'true') return;
            button.dataset.listenerAttached = 'true';
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                removeFromCart(id);
            });
        });
    }

    function changeQuantity(productId, action) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) return;
        if (action === 'increase') {
            cart[itemIndex].quantity++;
        } else if (action === 'decrease') {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
        }
        updateCartView();
        saveCartToLocalStorage();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartView();
        saveCartToLocalStorage();
    }

    function toggleCart() {
        if (sideCart && cartOverlay) {
            sideCart.classList.toggle('open');
            cartOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        }
    }

    // --- Event Listeners (General) ---
    if (cartButton) cartButton.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
    if (floatingCartBtn) floatingCartBtn.addEventListener('click', toggleCart);

    // --- Hamburger Menu Logic ---
    if (hamburgerMenuBtn && mobileMenuPanel) {
        hamburgerMenuBtn.addEventListener('click', () => {
            mobileMenuPanel.classList.toggle('mobile-menu-open');
            hamburgerMenuBtn.classList.toggle('active');
            if (mobileMenuOverlay) mobileMenuOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll-menu'); // Para evitar scroll del body cuando el menú está abierto
        });

        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', () => {
                mobileMenuPanel.classList.remove('mobile-menu-open');
                hamburgerMenuBtn.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll-menu');
            });
        }

        // Cerrar menú al hacer clic en un enlace dentro del panel
        const mobileMenuLinks = mobileMenuPanel.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuPanel.classList.remove('mobile-menu-open');
                hamburgerMenuBtn.classList.remove('active');
                if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll-menu');
            });
        });
    }


    // --- Header Scroll Logic ---
    let lastScrollTop = 0;
    const headerHeight = mainHeader ? mainHeader.offsetHeight : 70; // Obtener altura real o usar default
    const subNavbarHeight = subNavbar ? subNavbar.offsetHeight : 50;

    window.addEventListener('scroll', () => {
        if (!mainHeader || !subNavbar) return;

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
            // Scroll Down
            mainHeader.classList.add('header-hidden');
            document.body.classList.add('main-header-scrolled-past');
             // El padding-top del body ya está en var(--header-height)
            // La sub-navbar se pegará a top:0 debido a position:sticky y el header oculto
        } else {
            // Scroll Up or at top
            if (scrollTop <= headerHeight) { // O alguna otra condición para mostrarlo de nuevo, ej. scrollTop < lastScrollTop
                mainHeader.classList.remove('header-hidden');
                document.body.classList.remove('main-header-scrolled-past');
            }
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling

        // Ajustar el padding-top del body para que el contenido no salte cuando el header se oculta/muestra
        // y la subnavbar se vuelve sticky en la parte superior.
        // Esto es complejo porque el main-header es position:fixed y la sub-navbar position:sticky
        // Si el main-header se oculta, el espacio que ocupaba debe ser compensado si no, la sub-navbar salta.
        // La sub-navbar se pega a top:0 cuando .main-header-scrolled-past está en body.
        // Si el main-header es visible, la sub-navbar se pega a top:var(--header-height)
        // El padding-top inicial del body es var(--header-height). Cuando el header se oculta,
        // la sub-navbar por sí sola ocupará el espacio superior, por lo que el padding-top del body
        // debería cambiar a var(--sub-navbar-height) si la sub-navbar es lo único visible y fijo arriba.
        // Sin embargo, con position:sticky para la sub-navbar, el flujo del documento ya la considera.
        // El problema principal es el main-header con position:fixed.
        // Cuando el main-header se oculta, el padding-top del body debe seguir siendo var(--header-height)
        // para que la sub-navbar (que está después en el DOM) se posicione correctamente.
        // La clase .main-header-scrolled-past en el body ayuda a la sub-navbar a cambiar su 'top' en CSS.

        // No se necesita ajuste dinámico de padding-top aquí si el CSS está bien configurado
        // con position:sticky para sub-navbar y el padding-top inicial del body.
    }, false);


    // --- Page-Specific Logic ---
    if (currentPage === 'catalog') {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const catalogSearchInput = document.getElementById('catalog-search-input');
        const catalogSearchBtn = document.getElementById('catalog-search-btn');

        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    currentCatalogFilter = button.dataset.category;
                    renderProducts(currentCatalogFilter, catalogSearchInput ? catalogSearchInput.value.trim() : '');
                });
            });
        }

        if (catalogSearchBtn && catalogSearchInput) {
            const performSearch = () => {
                renderProducts(currentCatalogFilter, catalogSearchInput.value.trim());
            };
            catalogSearchBtn.addEventListener('click', performSearch);
            catalogSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = urlParams.get('category');
        if (categoryFromUrl) {
            const targetButton = document.querySelector(`.filter-btn[data-category="${categoryFromUrl}"]`);
            if (targetButton && filterButtons.length > 0) {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                targetButton.classList.add('active');
                currentCatalogFilter = categoryFromUrl;
            }
        }
    }

    // --- Animations ---
    function applyFadeInAnimations() {
        const sectionsToAnimate = document.querySelectorAll('.hero, .catalog-hero, .categories-section, .products-section, .catalog-filters-section, .main-footer');
        sectionsToAnimate.forEach((section, index) => {
            if (section && typeof section.classList !== 'undefined' && !section.classList.contains('fade-in')) { // Check if section exists and not already animated
                section.style.animationDelay = `${index * 0.15}s`;
                section.classList.add('fade-in');
            }
        });
    }

    // --- Age Gate Logic (Eliminada) ---
    // function handleAgeGate() { ... }

    // --- Initialization ---
    loadCartFromLocalStorage();

    let initialFilterForRender = 'all';
    if (currentPage === 'catalog') {
        initialFilterForRender = currentCatalogFilter;
    }
    renderProducts(initialFilterForRender);
    applyFadeInAnimations();

    // --- PDF Generation Logic (Eliminada) ---
    // const checkoutPdfBtn = document.getElementById('checkout-pdf-btn'); // Ya no existe este ID
    // function generateOrderPDF() { ... } // Función eliminada
    // Event listener para checkoutPdfBtn eliminado

    // El botón .checkout-button ahora no tiene un listener específico aquí,
    // por lo que volverá a su comportamiento no funcional (o el que tuviera antes).

});
