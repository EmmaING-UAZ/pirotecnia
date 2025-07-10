document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    const productModal = document.getElementById('product-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

    // Filtrado de productos
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;

            // Estilo de botones de filtro
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-yellow-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-800');
            });
            button.classList.add('bg-yellow-500', 'text-white');
            button.classList.remove('bg-gray-200', 'text-gray-800');

            // Mostrar/ocultar productos
            productItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Abrir modal de detalles del producto
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-item');
            const title = productCard.querySelector('h3').textContent;
            const imgSrc = productCard.querySelector('img').src;
            const price = productCard.querySelector('.text-yellow-600').textContent;
            const description = productCard.querySelector('.text-sm').textContent;

            const addToCartBtnInsideCard = productCard.querySelector('.add-to-cart-btn');
            const productId = addToCartBtnInsideCard.dataset.id;
            const productName = addToCartBtnInsideCard.dataset.name;
            const productPrice = addToCartBtnInsideCard.dataset.price;

            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-img').src = imgSrc;
            document.getElementById('modal-img').alt = title;
            document.getElementById('modal-description').textContent = description;
            document.getElementById('modal-price').textContent = price;

            const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
            modalAddToCartBtn.dataset.id = productId;
            modalAddToCartBtn.dataset.name = productName;
            modalAddToCartBtn.dataset.price = productPrice;


            productModal.classList.remove('hidden');
        });
    });

    // Cerrar modal
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            productModal.classList.add('hidden');
        });
    }

    // Cerrar modal al hacer clic fuera de él
    if(productModal){
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.classList.add('hidden');
            }
        });
    }
});
