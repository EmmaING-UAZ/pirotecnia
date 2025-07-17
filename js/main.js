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
        { id: 'prod001', name: 'Abeja de Cartón', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod002', name: 'Abejorro', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod003', name: 'Algodón de Humo', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod004', name: 'Balón de Humo', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod005', name: 'Bazuca 2"', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod006', name: 'Crisantemo 2"', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod007', name: 'Bazuca 3°', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod008', name: 'Crisantemo 3°', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod009', name: 'Bazuca 4°', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod010', name: 'Crisantemo 4°', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod011', name: 'Bazuca 4 Triple', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod012', name: 'Crisantemo 4 Triple', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod013', name: 'Bazuca Baby', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod014', name: 'Bengala Chica de Cajita', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod015', name: 'Bengala de Humo', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod016', name: 'Bengala Clínica NO', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod017', name: 'Bengala Clínica HO', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod018', name: 'Bengala Clínica H2', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod019', name: 'Billete', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod020', name: 'Cohete Blanco', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod021', name: 'Bob Esponja', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod022', name: 'Bola de Humo', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod023', name: 'Bola de Luz', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod024', name: 'Bota Misil de 25 Disparos', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod025', name: 'Bota Misil de 36 Disparos', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod026', name: 'Bota Misil de 50 Disparos', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod027', name: 'Bota Misil de 100 Disparos', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod028', name: 'Bota Misil de 200 Disparos', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod029', name: 'Bota Misil de 300 Disparos', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod030', name: 'Buscape', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod031', name: 'Camela', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod032', name: 'Canastilla de Voladoras', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod033', name: 'Candela de 5 Disparos', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod034', name: 'Candela de 10 Disparos', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod035', name: 'Canon Bebé', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod036', name: 'Canon Bombón', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod037', name: 'Canon Mediano', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod038', name: 'Canon R-15', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod039', name: 'Caramelo Grande', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod040', name: 'Caramelo Jumbo', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod041', name: 'Caramelo Mediano', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod042', name: 'Carrillera de 1 Metro', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod043', name: 'Carrillera de Paquete', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod044', name: 'Carrillera de 5 Metros', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod045', name: 'Carrillera de 10 Metros', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod046', name: 'Catarina', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod047', name: 'Cereza Titanium', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod048', name: 'Cigarro', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod049', name: 'Cohete Bomba', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod050', name: 'Charros', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod051', name: 'Chispero de Lluvia Fra', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod052', name: 'Chupacabras de Piso', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod053', name: 'Cohete de Chupacabras', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod054', name: 'Cohete de Cracker', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod055', name: 'Cohete de Esfera', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod056', name: 'Cohete de Paracaídas', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod057', name: 'Cohete Pajarito', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod058', name: 'Cohete de Luz', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod059', name: 'Cohete de Trueno Especial', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod060', name: 'Cohete de Trueno con Silbato', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod061', name: 'Combate Naval Chico', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod062', name: 'Morralto', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'No clasificado' },
        { id: 'prod063', name: 'Cometa Comercial', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod064', name: 'Cometa Intermedio', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod065', name: 'Cometa Super', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod066', name: 'Cometín', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod067', name: 'Cometón', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod068', name: 'Cracker Bomb', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod069', name: 'Crayon', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod070', name: 'Crisantemo 6°', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod071', name: 'Crisantemo 8°', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod072', name: 'Dragon Ballz', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod073', name: 'Escupidor Comercial', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod074', name: 'Escupidor de Color', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod075', name: 'Escupidor de Cracker', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod076', name: 'Escupidor de Diamantina', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod077', name: 'Espanta Suegras', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod078', name: 'Flash', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod079', name: 'Frozen', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod080', name: 'Gallinita', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod081', name: 'Garra', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod082', name: 'Garra Mega', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod083', name: 'Garrita', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod084', name: 'Globos de Cantolla', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod085', name: 'Huevo de Codorniz Mega', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod086', name: 'Huevo de Pato', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod087', name: 'Hulk', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod088', name: 'Hulk Mega', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod089', name: 'Hulk Mini', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod090', name: 'Lluvia de Estrellas', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod091', name: 'Luces de Bengala de 12 M', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod092', name: 'Luces de Bengala de 1 M', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod093', name: 'Metechto', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod094', name: 'Combate Naval Mega', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod095', name: 'Mini OVNI', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod096', name: 'Misil', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod097', name: 'Olla Chica', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod098', name: 'Olla Mediana', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod099', name: 'Olla Jumbo', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod100', name: 'OVNI', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod101', name: 'Pajarera de Luz', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod102', name: 'Pajarera de Trueno', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod103', name: 'Paloma Bebé', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod104', name: 'Paloma Pintada', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod105', name: 'Paloma Chica', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod106', name: 'Paloma de Luz', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod107', name: 'Paloma Grande', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod108', name: 'Paloma Jumbo', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod109', name: 'Paloma Mediana', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod110', name: 'Paloma Muñequita', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod111', name: 'Paloma Super', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod112', name: 'Patito Chico', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod113', name: 'Patito Grande', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod114', name: 'Pepa Pig', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod115', name: 'Abeja', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod116', name: 'Rosa de Cracker', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod117', name: 'Rosa de Luz', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod118', name: 'Silbato de Piso', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod119', name: 'Silbato Especial', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod120', name: 'Silbato Toro Loco', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod121', name: 'Sopa Marcha', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod122', name: 'Tamauros', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod123', name: 'Tanque de Guerra', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod124', name: 'Tortuga', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod125', name: 'Trabuco Chico', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod126', name: 'Trabuco Jumbo', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod127', name: 'Tubo 4°', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod128', name: 'Tubo 6°', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod129', name: 'Tubo 8°', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod130', name: 'Vara Alcon Cobra', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod131', name: 'Vara de Silbato', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod132', name: 'Vara de Silbato Urba', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod133', name: 'Vecindad de Chavo', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod134', name: 'Vela Paselera', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod135', name: 'Volcan de Diamantina', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod136', name: 'Carita de Diablo', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod137', name: 'Carta de Diablo Mediana', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod138', name: 'Carta de Diablo Grande', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod139', name: 'Cohete de Esfera Chico', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod140', name: 'Diente de León', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod141', name: 'Tornado', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod142', name: 'Walking Dead', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod143', name: 'Lady Bug', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod144', name: 'Enogi', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod145', name: 'Among Us', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod146', name: 'Pepa Bob', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod147', name: 'Chicornio', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod148', name: 'Mnois', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod149', name: 'Volcan Importado', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod150', name: 'Emporio Importado', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod151', name: 'M-500', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod152', name: 'N-1000', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod153', name: 'Bascadito', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod154', name: 'Mini Cake', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod155', name: 'Cargola Gregolas', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod156', name: 'Hiper Cometín', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod157', name: 'Super Cometín', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod158', name: 'Camelia Grande', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod159', name: 'Palos Locos', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod160', name: 'Garapinados Misanos', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod161', name: 'Araña', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod162', name: 'Sabritas', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod163', name: 'Mini Llorona', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod164', name: 'Bengala China de Color', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod165', name: 'Candil Chino 0.5', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod166', name: 'Candil Chino 0.5 (688 Disparos)', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod167', name: 'Candil Romano 0.5', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod168', name: 'Candil Romano 1.5', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Pirotecnia profesional' },
        { id: 'prod169', name: '10', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'General' },
        { id: 'prod170', name: 'Escupidor Mágico', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod171', name: 'Escupidor Mágico (60 Disparos)', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod172', name: 'Escupidor Mágico (30 Disparos)', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod173', name: 'Volcan de Cracker', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Juguetería' },
        { id: 'prod174', name: 'Monster Shot', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod175', name: 'Cohete Espacial', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' },
        { id: 'prod176', name: 'Wolf Warrior', price: 10.00, image: 'https://via.placeholder.com/300x200.png?text=Producto', description: 'Descripción no disponible.', category: 'Aereo' }
    ];

    const categories = [
        'Mostrar Todos',
        'Juguetería',
        'Pirotecnia profesional',
        'Aereo',
        'No clasificado'
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
