document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad del menú desplegable para "Catálogo"
    const catalogoLink = document.querySelector('a[href="pages/catalogo.html"], a[href="../pages/catalogo.html"]'); // Ajustar selectores si es necesario
    const navCatalogoItem = document.getElementById('nav-catalogo'); // Específico para el navbar fijo

    let dropdownContentHTML = `
        <div class="dropdown-content">
            <a href="jugueteria.html">Juguetería</a>
            <a href="importados.html">Importados</a>
            <a href="revelacion.html">Revelación de Género</a>
            <a href="cakes.html">Creaciones Cakes Nacionales</a>
        </div>
    `;

    // Identificar si estamos en index.html o en una subpágina
    const isIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
    const isCatalogoPage = window.location.pathname.includes('catalogo.html'); // Para futura página real de catálogo
    const isTempPage = window.location.pathname.includes('temp_page.html');


    function setupDropdown(linkElement) {
        if (linkElement) {
            const parentNavItem = linkElement.parentElement; // Asumimos que el 'a' está dentro de un 'div' o 'li'
            parentNavItem.classList.add('dropdown');

            // Corrige los href en el dropdown según la ubicación actual
            let currentPathPrefix = "";
            if (!isIndexPage) { // Si estamos en una subpágina como temp_page.html
                // No se necesita prefijo si los enlaces del dropdown son relativos a la carpeta pages/
            }

            let correctedDropdownContentHTML = `
            <div class="dropdown-content">
                <a href="${currentPathPrefix}jugueteria.html">Juguetería</a>
                <a href="${currentPathPrefix}importados.html">Importados</a>
                <a href="${currentPathPrefix}revelacion.html">Revelación de Género</a>
                <a href="${currentPathPrefix}cakes.html">Creaciones Cakes Nacionales</a>
            </div>
            `;
            linkElement.insertAdjacentHTML('afterend', correctedDropdownContentHTML);

            const dropdownContent = parentNavItem.querySelector('.dropdown-content');

            linkElement.addEventListener('click', function(event) {
                // Prevenir navegación si es solo para abrir/cerrar dropdown en algunas implementaciones
                // Pero en este caso, el link principal "Catálogo" también es una página.
                // Considerar si el click en "Catálogo" debe ir a catalogo.html o solo abrir el menú.
                // Por ahora, permite la navegación Y muestra/oculta el menú.
                if (dropdownContent) {
                    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
                }
            });

            // Opcional: Cerrar el dropdown si se hace clic fuera
            window.addEventListener('click', function(event) {
                if (dropdownContent && !parentNavItem.contains(event.target)) {
                    dropdownContent.style.display = 'none';
                }
            });
        }
    }

    // Configurar desplegable para el navbar transparente (index) y fijo (otras páginas)
    const catalogoLinkIndex = document.querySelector('.navbar.transparent a[href="pages/catalogo.html"]'); // Actualizado a catalogo.html
    const catalogoLinkFixed = document.querySelector('.navbar.fixed a[href="catalogo.html"]');


    if (isIndexPage && catalogoLinkIndex) {
        // En index.html, el enlace a catálogo es "pages/temp_page.html"
        // y los enlaces del dropdown deben ser "pages/jugueteria.html", etc.
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

    } else if (!isIndexPage && catalogoLinkFixed) { // Para páginas en /pages/
         // En pages/*.html, el enlace a catálogo es "catalogo.html" (hermano)
        // y los enlaces del dropdown deben ser "jugueteria.html", etc. (hermanos)
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

        // Si estamos en temp_page.html, marcar "Catálogo (Test)" o "Catálogo" como activo
        if (isTempPage && (link.getAttribute('href').includes('temp_page.html') || link.getAttribute('href').includes('catalogo.html'))) {
            link.classList.add('active');
        }
    });

    // Funcionalidad del botón "Ir Arriba"
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // La detección de scroll puede usar document.documentElement o document.body
    // Es más robusto verificar ambos o usar window.pageYOffset
    function handleScroll() {
        if (scrollToTopBtn) { // Verificar si el botón existe en la página actual
            if (window.pageYOffset > 400) { // window.pageYOffset es más compatible
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    if (scrollToTopBtn) {
        document.addEventListener('scroll', handleScroll);
        scrollToTopBtn.addEventListener('click', scrollToTop);
    }
});
