document.addEventListener('DOMContentLoaded', () => {
    // Menú Móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Cambiar aria-expanded para accesibilidad
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.setAttribute('aria-hidden', isExpanded);
        });
    }

    // Botón Scroll to Top
    const scrollTopButton = document.getElementById('scrollTopButton');

    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { // Mostrar el botón después de 300px de scroll
                scrollTopButton.classList.remove('hidden');
                scrollTopButton.classList.add('flex'); // O 'block' según el display que uses
            } else {
                scrollTopButton.classList.add('hidden');
                scrollTopButton.classList.remove('flex');
            }
        });

        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Lógica para abrir y cerrar el panel del carrito (común a todas las páginas)
    const cartButtonDesktop = document.getElementById('cart-button-desktop');
    const cartButtonMobile = document.getElementById('cart-button-mobile');
    const cartPanel = document.getElementById('cart-panel');
    const closeCartButton = document.getElementById('close-cart-button');
    const cartOverlay = document.getElementById('cart-overlay');

    const openCartPanel = () => {
        if (cartPanel && cartOverlay) {
            cartPanel.classList.remove('translate-x-full');
            cartOverlay.classList.remove('hidden');
            document.body.classList.add('cart-panel-open'); // Para evitar scroll del body
        }
    };

    const closeCartPanel = () => {
        if (cartPanel && cartOverlay) {
            cartPanel.classList.add('translate-x-full');
            cartOverlay.classList.add('hidden');
            document.body.classList.remove('cart-panel-open');
        }
    };

    if (cartButtonDesktop) {
        cartButtonDesktop.addEventListener('click', openCartPanel);
    }
    if (cartButtonMobile) {
        cartButtonMobile.addEventListener('click', openCartPanel);
    }
    if (closeCartButton) {
        closeCartButton.addEventListener('click', closeCartPanel);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartPanel); // Cerrar al hacer clic en el overlay
    }

    // Cerrar carrito con tecla Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !cartPanel.classList.contains('translate-x-full')) {
            closeCartPanel();
        }
    });


    // Scroll Reveal (simple implementación con Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-slide-in-left, .reveal-slide-in-right');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // No observar más una vez que es visible
                }
            });
        }, { threshold: 0.1 }); // Ajustar threshold según necesidad

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- CARRUSEL PRODUCTOS DESTACADOS (INDEX.HTML) ---
    const carouselTrack = document.getElementById('carousel-track');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const carouselContainer = document.getElementById('carousel-container');

    const featuredProducts = [
        {
            id: 'fp001',
            name: 'Batería "Show Imperial"',
            price: 1250.00,
            image: 'img/productos/cake_imperial.jpg',
            description: 'Impresionante batería de 100 disparos con variedad de efectos coloridos y sonoros. Ideal para grandes celebraciones.',
            category: 'Cakes (baterías)'
        },
        {
            id: 'fp002',
            name: 'Luz de Bengala (Paq. 10)',
            price: 80.00,
            image: 'img/productos/bengalas.jpg',
            description: 'Clásicas luces de bengala, seguras y divertidas para todas las edades. Chispas doradas brillantes.',
            category: 'Juguetería'
        },
        {
            id: 'fp003',
            name: 'Volcán "Etna Plateado"',
            price: 150.00,
            image: 'img/productos/volcan_etna.jpg',
            description: 'Fuente de chispas plateadas de larga duración que alcanza hasta 3 metros de altura.',
            category: 'Pirotecnia fría'
        },
        {
            id: 'fp004',
            name: 'Cañón Revelación (Azul)',
            price: 220.00,
            image: 'img/productos/revelacion_azul.jpg',
            description: 'Cañón de confeti y polvo de color azul para revelar el género del bebé. ¡Un momento emocionante!',
            category: 'Revelaciones'
        },
        {
            id: 'fp005',
            name: 'Paloma "Estruendo Celestial"',
            price: 45.00,
            image: 'img/productos/paloma_estruendo.jpg',
            description: 'Petardo de gran trueno, para los amantes de los efectos sonoros potentes.',
            category: 'Pirotecnia profesional'
        },
        {
            id: 'fp006',
            name: 'Crisantemo Rojo Gigante',
            price: 350.00,
            image: 'https://via.placeholder.com/300x200.png?text=Crisantemo+Rojo', // Placeholder
            description: 'Un efecto clásico de crisantemo rojo que llena el cielo. Impactante y elegante.',
            category: 'Cakes (baterías)'
        }
    ];

    let currentCarouselIndex = 0;
    let itemsPerPage = getItemsPerPage();
    let totalPages = 0;

    function getItemsPerPage() {
        if (window.innerWidth < 640) return 1; // sm
        if (window.innerWidth < 1024) return 2; // md
        return 3; // lg and up
    }

    function renderCarouselItems() {
        if (!carouselTrack || !carouselContainer) return;
        carouselTrack.innerHTML = ''; // Limpiar
        itemsPerPage = getItemsPerPage();
        totalPages = Math.ceil(featuredProducts.length / itemsPerPage);

        featuredProducts.forEach(product => {
            const productCard = `
                <div class="carousel-item w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 p-2">
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full hover-effect">
                        <img src="${product.image || 'https://via.placeholder.com/300x200.png?text=Producto'}" alt="${product.name}" class="w-full h-48 object-cover">
                        <div class="p-4 flex flex-col flex-grow">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2 truncate" title="${product.name}">${product.name}</h3>
                            <p class="text-sm text-gray-600 mb-3 flex-grow">${product.description.length > 60 ? product.description.substring(0, 60) + '...' : product.description}</p>
                            <p class="text-xl font-bold text-yellow-600 mb-4">${formatCurrency(product.price)}</p>
                            <div class="mt-auto">
                                <button onclick="window.addToCart({id:'${product.id}', name:'${product.name}', price:${product.price}, image:'${product.image}', description:'${product.description}'}, 1)"
                                        class="w-full bg-yellow-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-yellow-600 transition-colors duration-300 text-sm">
                                    Agregar al Carrito
                                </button>
                                <button onclick="window.openProductModal({id:'${product.id}', name:'${product.name}', price:${product.price}, image:'${product.image}', description:'${product.description}'})"
                                        class="w-full mt-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300 text-sm">
                                    Ver Más
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            carouselTrack.innerHTML += productCard;
        });
        updateCarousel();
    }

    function updateCarousel() {
        if (!carouselTrack || !carouselContainer) return;
        const itemWidth = carouselContainer.offsetWidth / itemsPerPage;
        carouselTrack.style.transform = `translateX(-${currentCarouselIndex * itemWidth * itemsPerPage}px)`;

        if (prevButton) prevButton.disabled = currentCarouselIndex === 0;
        if (nextButton) nextButton.disabled = currentCarouselIndex >= totalPages -1 ;

        // Para un carrusel que no es "infinito", ocultar botones si no hay más items
        if (featuredProducts.length <= itemsPerPage) {
            if(prevButton) prevButton.classList.add('hidden');
            if(nextButton) nextButton.classList.add('hidden');
        } else {
            if(prevButton) prevButton.classList.remove('hidden');
            if(nextButton) nextButton.classList.remove('hidden');
        }
    }

    if (prevButton && nextButton && carouselTrack) {
        prevButton.addEventListener('click', () => {
            if (currentCarouselIndex > 0) {
                currentCarouselIndex--;
                updateCarousel();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentCarouselIndex < totalPages - 1) {
                currentCarouselIndex++;
                updateCarousel();
            }
        });

        window.addEventListener('resize', () => {
            currentCarouselIndex = 0; // Resetear en resize para recalcular
            renderCarouselItems();
        });

        // Renderizar carrusel al inicio
        renderCarouselItems();
    }
    // --- FIN CARRUSEL ---

    // --- LÓGICA PARA PÁGINA DE CATÁLOGO ---
    const catalogContainer = document.getElementById('catalog-product-grid');
    const categoryFiltersContainer = document.getElementById('category-filters');

    // Productos de ejemplo para el catálogo (más extenso)
    const allProducts = [
        // Pirotecnia profesional
        { id: 'cat001', name: 'Batería "Titanes del Cielo"', price: 2500.00, image: 'img/productos/cat_titanes.jpg', description: 'Una completa exhibición de 200 disparos con efectos variados: palmeras, crisantemos, y final de cracker. Duración aproximada: 2 minutos.', category: 'Pirotecnia profesional' },
        { id: 'cat002', name: 'Carcasa "Explosión Galáctica"', price: 350.00, image: 'img/productos/cat_galactica.jpg', description: 'Carcasa de 5 pulgadas con potente explosión y efecto de sauce dorado llorón. Solo para expertos.', category: 'Pirotecnia profesional' },
        { id: 'fp005', name: 'Paloma "Estruendo Celestial"', price: 45.00, image: 'img/productos/paloma_estruendo.jpg', description: 'Petardo de gran trueno, para los amantes de los efectos sonoros potentes.', category: 'Pirotecnia profesional' },

        // Juguetería
        { id: 'fp002', name: 'Luz de Bengala (Paq. 10)', price: 80.00, image: 'img/productos/bengalas.jpg', description: 'Clásicas luces de bengala, seguras y divertidas para todas las edades. Chispas doradas brillantes.', category: 'Juguetería' },
        { id: 'cat003', name: 'Chifladores (Bolsa 50 pzs)', price: 60.00, image: 'img/productos/cat_chifladores.jpg', description: 'Pequeños cohetes que ascienden con un silbido característico. Diversión asegurada para niños (bajo supervisión).', category: 'Juguetería' },
        { id: 'cat004', name: 'Abejitas Voladoras (Docena)', price: 90.00, image: 'img/productos/cat_abejitas.jpg', description: 'Pequeños artefactos que giran en el suelo y luego se elevan emitiendo chispas. Muy populares.', category: 'Juguetería' },
        { id: 'cat014', name: 'Varitas Mágicas Chispeantes', price: 120.00, image: 'https://via.placeholder.com/300x200.png?text=Varitas+Mágicas', description: 'Varitas que emiten una lluvia de chispas doradas y plateadas, perfectas para fotos.', category: 'Juguetería' },


        // Cakes (baterías)
        { id: 'fp001', name: 'Batería "Show Imperial"', price: 1250.00, image: 'img/productos/cake_imperial.jpg', description: 'Impresionante batería de 100 disparos con variedad de efectos coloridos y sonoros. Ideal para grandes celebraciones.', category: 'Cakes (baterías)' },
        { id: 'cat005', name: 'Cake "Noche Estrellada"', price: 800.00, image: 'img/productos/cat_noche_estrellada.jpg', description: 'Batería de 49 disparos con efectos de estrellas intermitentes en azul y blanco, culminando con cracker.', category: 'Cakes (baterías)' },
        { id: 'cat006', name: 'Mini Cake "Arcoíris"', price: 350.00, image: 'img/productos/cat_arcoiris.jpg', description: 'Pequeña pero potente batería de 25 disparos con colores vibrantes: rojo, verde, azul, amarillo y púrpura.', category: 'Cakes (baterías)' },
        { id: 'fp006', name: 'Crisantemo Rojo Gigante', price: 350.00, image: 'https://via.placeholder.com/300x200.png?text=Crisantemo+Rojo', description: 'Un efecto clásico de crisantemo rojo que llena el cielo. Impactante y elegante.', category: 'Cakes (baterías)' },


        // Revelaciones
        { id: 'fp004', name: 'Cañón Revelación (Azul)', price: 220.00, image: 'img/productos/revelacion_azul.jpg', description: 'Cañón de confeti y polvo de color azul para revelar el género del bebé. ¡Un momento emocionante!', category: 'Revelaciones' },
        { id: 'cat007', name: 'Cañón Revelación (Rosa)', price: 220.00, image: 'img/productos/cat_revelacion_rosa.jpg', description: 'Cañón de confeti y polvo de color rosa. La sorpresa perfecta para tu gender reveal party.', category: 'Revelaciones' },
        { id: 'cat008', name: 'Humo de Color (Azul o Rosa)', price: 180.00, image: 'img/productos/cat_humo_color.jpg', description: 'Lata de humo denso y vibrante, disponible en azul o rosa. Ideal para sesiones de fotos y revelaciones.', category: 'Revelaciones' },

        // Pirotecnia fría
        { id: 'fp003', name: 'Volcán "Etna Plateado"', price: 150.00, image: 'img/productos/volcan_etna.jpg', description: 'Fuente de chispas plateadas de larga duración que alcanza hasta 3 metros de altura. Sin humo excesivo.', category: 'Pirotecnia fría' },
        { id: 'cat009', name: 'Chispero Electrónico (Fuente)', price: 250.00, image: 'img/productos/cat_chispero.jpg', description: 'Fuente de pirotecnia fría controlable electrónicamente, ideal para escenarios y eventos en interiores. Varias alturas.', category: 'Pirotecnia fría' },
        { id: 'cat010', name: 'Bengala de Humo Frío (Colores)', price: 95.00, image: 'img/productos/cat_bengala_humo_frio.jpg', description: 'Bengala que produce humo de colores vibrantes sin calor excesivo. Disponible en rojo, verde, azul, amarillo.', category: 'Pirotecnia fría' }
    ];

    const categories = [
        'Mostrar Todos',
        'Pirotecnia profesional',
        'Juguetería',
        'Cakes (baterías)',
        'Revelaciones',
        'Pirotecnia fría'
    ];

    function renderProductCard(product) {
        const truncatedDescription = product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description;
        return `
            <div class="product-card bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover-effect reveal-fade-in" data-category="${product.category}">
                <img src="${product.image || 'https://via.placeholder.com/300x200.png?text=Producto'}" alt="${product.name}" class="w-full h-56 object-cover">
                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2 truncate" title="${product.name}">${product.name}</h3>
                    <p class="text-sm text-gray-500 mb-3 flex-grow">${truncatedDescription}</p>
                    <p class="text-2xl font-bold text-yellow-600 mb-5">${formatCurrency(product.price)}</p>
                    <div class="mt-auto space-y-2">
                        <button onclick="window.addToCart({id:'${product.id}', name:'${product.name}', price:${product.price}, image:'${product.image}', description:'${product.description}'}, 1)"
                                class="w-full bg-yellow-500 text-white py-2.5 px-4 rounded-md font-semibold hover:bg-yellow-600 transition-colors duration-300 text-base">
                            Agregar al Carrito
                        </button>
                        <button onclick="window.openProductModal({id:'${product.id}', name:'${product.name}', price:${product.price}, image:'${product.image}', description:'${product.description}'})"
                                class="w-full bg-gray-200 text-gray-700 py-2.5 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300 text-base">
                            Ver Más
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function displayProducts(productsToDisplay) {
        if (!catalogContainer) return;
        catalogContainer.innerHTML = '';
        productsToDisplay.forEach(product => {
            catalogContainer.innerHTML += renderProductCard(product);
        });
        // Re-initialize ScrollReveal for newly added cards (if needed, or ensure it runs once after all are added)
        const newRevealElements = catalogContainer.querySelectorAll('.reveal-fade-in');
        if (newRevealElements.length > 0 && typeof IntersectionObserver === 'function') {
             const tempObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            newRevealElements.forEach(el => tempObserver.observe(el));
        }
    }

    function renderCategoryFilters() {
        if (!categoryFiltersContainer) return;
        categoryFiltersContainer.innerHTML = '';
        categories.forEach(category => {
            const filterButton = document.createElement('button');
            filterButton.textContent = category;
            filterButton.classList.add('px-4', 'py-2', 'm-1', 'rounded-md', 'transition-colors', 'duration-300', 'font-medium', 'hover-effect');
            if (category === 'Mostrar Todos') {
                filterButton.classList.add('bg-yellow-500', 'text-white');
                filterButton.dataset.active = "true";
            } else {
                filterButton.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-yellow-400', 'hover:text-white');
            }
            filterButton.addEventListener('click', () => {
                handleFilterClick(category, filterButton);
            });
            categoryFiltersContainer.appendChild(filterButton);
        });
    }

    function handleFilterClick(category, clickedButton) {
        // Update active state for buttons
        const buttons = categoryFiltersContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.classList.remove('bg-yellow-500', 'text-white');
            button.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-yellow-400', 'hover:text-white');
            button.dataset.active = "false";
        });
        clickedButton.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-yellow-400');
        clickedButton.classList.add('bg-yellow-500', 'text-white');
        clickedButton.dataset.active = "true";

        if (category === 'Mostrar Todos') {
            displayProducts(allProducts);
        } else {
            const filteredProducts = allProducts.filter(product => product.category === category);
            displayProducts(filteredProducts);
        }
    }


    if (catalogContainer && categoryFiltersContainer) {
        // Initial render on catalog page
        renderCategoryFilters();
        displayProducts(allProducts);
    }
    // --- FIN LÓGICA PÁGINA DE CATÁLOGO ---

});

// Pequeña función helper para formatear moneda (ejemplo)
// Asegurarse que está disponible globalmente o importarla/definirla donde se necesite.
if (typeof formatCurrency !== 'function') {
    function formatCurrency(amount) {
        return `$${parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }
}
