document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad del menú desplegable para "Catálogo"
    const catalogoLink = document.querySelector('a[href="pages/catalogo.html"], a[href="../pages/catalogo.html"]');
    const navCatalogoItem = document.getElementById('nav-catalogo');

    // Identificar si estamos en index.html o en una subpágina
    const isIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
    const isCatalogoPage = window.location.pathname.includes('catalogo.html');
    const isTempPage = window.location.pathname.includes('temp_page.html'); // Aunque temp_page ya no existe, la lógica de active link la usa

    // Configurar desplegable para el navbar transparente (index) y fijo (otras páginas)
    const catalogoLinkIndex = document.querySelector('.navbar.transparent a[href="pages/catalogo.html"]');
    const catalogoLinkFixed = document.querySelector('.navbar.fixed a[href="catalogo.html"]');

    if (isIndexPage && catalogoLinkIndex) {
        let indexDropdownContent = `
        <div class="dropdown-content">
            <a href="pages/jugueteria.html">Juguetería</a>
            <a href="pages/importados.html">Importados</a>
            <a href="pages/revelacion.html">Revelación de Género</a>
            <a href="pages/cakes.html">Creaciones Cakes Nacionales</a>
        </div>`;
        catalogoLinkIndex.insertAdjacentHTML('afterend', indexDropdownContent);
        const parentNavItem = catalogoLinkIndex.parentElement;
        parentNavItem.classList.add('dropdown');
        const dropdownContent = parentNavItem.querySelector('.dropdown-content');

        catalogoLinkIndex.addEventListener('mouseenter', () => { if(dropdownContent) dropdownContent.style.display = 'block'; });
        parentNavItem.addEventListener('mouseleave', () => { if(dropdownContent) dropdownContent.style.display = 'none'; });

    } else if (!isIndexPage && catalogoLinkFixed) {
        let pagesDropdownContent = `
        <div class="dropdown-content">
            <a href="jugueteria.html">Juguetería</a>
            <a href="importados.html">Importados</a>
            <a href="revelacion.html">Revelación de Género</a>
            <a href="cakes.html">Creaciones Cakes Nacionales</a>
        </div>`;
        catalogoLinkFixed.insertAdjacentHTML('afterend', pagesDropdownContent);
        const parentNavItem = catalogoLinkFixed.parentElement;
        parentNavItem.classList.add('dropdown');
        const dropdownContent = parentNavItem.querySelector('.dropdown-content');

        catalogoLinkFixed.addEventListener('mouseenter', () => { if(dropdownContent) dropdownContent.style.display = 'block'; });
        parentNavItem.addEventListener('mouseleave', () => { if(dropdownContent) dropdownContent.style.display = 'none'; });
    }

    // Funcionalidad de subrayado para el enlace activo
    const navLinks = document.querySelectorAll('.navbar a');
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').substring(link.getAttribute('href').lastIndexOf('/') + 1);
        if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
            link.classList.add('active');
        }
        if (isTempPage && (link.getAttribute('href').includes('temp_page.html') || link.getAttribute('href').includes('catalogo.html'))) {
            link.classList.add('active');
        }
         // Si estamos en una página de categoría (ej: jugueteria.html) o de producto, marcar "Catálogo" como activo
        if (!isIndexPage && (link.getAttribute('href').endsWith('catalogo.html'))) {
            if (currentPage !== 'catalogo.html' && currentPage !== 'contacto.html' && currentPage !== 'sobre-nosotros.html' && currentPage !== 'reseñas.html' && currentPage !== 'advertencias.html' && currentPage !== 'politicas.html' && currentPage !== 'aviso-legal.html' ) {
                 // Asumimos que si no es una de las páginas estáticas principales, es una subpágina de catálogo
                link.classList.add('active');
            }
        }
    });

    // Funcionalidad del botón "Ir Arriba"
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    function handleScroll() {
        if (scrollToTopBtn) {
            if (window.pageYOffset > 400) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        }
    }
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (scrollToTopBtn) {
        document.addEventListener('scroll', handleScroll);
        scrollToTopBtn.addEventListener('click', scrollToTop);
    }

    // --- Inicio: Funcionalidad del Carrito de Compras ---
    const cartItemCountElement = document.getElementById('cart-item-count');
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    function updateCartCounter() {
        if (cartItemCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartItemCountElement.textContent = totalItems;
        }
    }

    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartTotalAmountElement = document.getElementById('cartTotalAmount');

        if (!cartItemsContainer || !cartTotalAmountElement) return;

        cartItemsContainer.innerHTML = ''; // Limpiar items anteriores
        let totalAmount = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                totalAmount += itemSubtotal;

                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Precio: $${item.price.toFixed(2)}</p>
                        <p>Subtotal: $${itemSubtotal.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-change" data-product-id="${item.id}" data-change="-1" aria-label="Disminuir cantidad">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="item-quantity-input" data-product-id="${item.id}" aria-label="Cantidad">
                        <button class="quantity-change" data-product-id="${item.id}" data-change="1" aria-label="Aumentar cantidad">+</button>
                    </div>
                    <div class="cart-item-actions">
                        <button class="remove-item-btn" data-product-id="${item.id}" aria-label="Eliminar ${item.name}">&times; Eliminar</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }
        cartTotalAmountElement.textContent = totalAmount.toFixed(2);
        updateCartCounter();
    }

    function addToCart(productId, productName, productPrice) {
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        let quantityToAdd = 1;

        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            const parsedQuantity = parseInt(quantityInput.value, 10);
            if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
                quantityToAdd = parsedQuantity;
            }
        }

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += quantityToAdd;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                quantity: quantityToAdd
            });
        }
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartCounter();

        if (cartModal && cartModal.style.display === 'block') {
            renderCartItems();
        }
        alert(`${productName} (x${quantityToAdd}) agregado al carrito!`);
    }

    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const productPrice = this.dataset.productPrice;
            addToCart(productId, productName, productPrice);
        });
    });

    updateCartCounter();
    // --- Fin: Funcionalidad del Carrito de Compras ---

    // --- Inicio: Funcionalidad del Modal del Carrito ---
    const cartModal = document.getElementById('cartModal');
    const cartLink = document.getElementById('cartLink');
    const closeCartModalBtn = document.getElementById('closeCartModal');

    function openCartModal() {
        if (cartModal) {
            cartModal.style.display = 'block';
            renderCartItems();
        }
    }

    function closeCartModal() {
        if (cartModal) {
            cartModal.style.display = 'none';
        }
    }

    if (cartLink) {
        cartLink.addEventListener('click', function(event) {
            event.preventDefault();
            openCartModal();
        });
    }

    if (closeCartModalBtn) {
        closeCartModalBtn.addEventListener('click', closeCartModal);
    }

    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            closeCartModal();
        }
    });
    // --- Fin: Funcionalidad del Modal del Carrito ---

    // --- Inicio: Acciones dentro del Modal del Carrito ---
    const cartItemsContainerGlobal = document.getElementById('cartItemsContainer');

    if (cartItemsContainerGlobal) {
        cartItemsContainerGlobal.addEventListener('click', function(event) {
            const target = event.target;

            if (target.classList.contains('remove-item-btn')) {
                const productId = target.dataset.productId;
                cart = cart.filter(item => item.id !== productId);
                localStorage.setItem('shoppingCart', JSON.stringify(cart));
                renderCartItems();
            }

            if (target.classList.contains('quantity-change')) {
                const productId = target.dataset.productId;
                const change = parseInt(target.dataset.change, 10);
                const itemIndex = cart.findIndex(item => item.id === productId);

                if (itemIndex > -1) {
                    cart[itemIndex].quantity += change;
                    if (cart[itemIndex].quantity <= 0) {
                        cart = cart.filter(item => item.id !== productId);
                    }
                    localStorage.setItem('shoppingCart', JSON.stringify(cart));
                    renderCartItems();
                }
            }
        });

        cartItemsContainerGlobal.addEventListener('change', function(event) {
            const target = event.target;
            if (target.classList.contains('item-quantity-input')) {
                const productId = target.dataset.productId;
                const newQuantity = parseInt(target.value, 10);
                const itemIndex = cart.findIndex(item => item.id === productId);

                if (itemIndex > -1) {
                    if (newQuantity > 0) {
                        cart[itemIndex].quantity = newQuantity;
                    } else {
                        cart = cart.filter(item => item.id !== productId);
                    }
                    localStorage.setItem('shoppingCart', JSON.stringify(cart));
                    renderCartItems();
                }
            }
        });
    }

    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
                cart = [];
                localStorage.setItem('shoppingCart', JSON.stringify(cart));
                renderCartItems();
            }
        });
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length > 0) {
                alert("Redirigiendo a la página de pago (funcionalidad no implementada).");
            } else {
                alert("Tu carrito está vacío. Añade productos antes de proceder al pago.");
            }
        });
    }
    // --- Fin: Acciones dentro del Modal del Carrito ---
});
