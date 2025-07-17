document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.getElementById('checkout-button');

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const cart = JSON.parse(localStorage.getItem('emmaFireworksCart')) || [];

            // Título
            doc.setFontSize(20);
            doc.text("Carrito de Compras", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

            // Contenido de la tabla
            const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Subtotal"];
            const tableRows = [];

            let total = 0;

            cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                const itemData = [
                    item.name,
                    item.quantity,
                    `$${item.price.toFixed(2)}`,
                    `$${subtotal.toFixed(2)}`
                ];
                tableRows.push(itemData);
                total += subtotal;
            });

            doc.autoTable(tableColumn, tableRows, { startY: 30 });

            const finalY = doc.autoTable.previous.finalY;

            // Total General
            doc.setFontSize(14);
            doc.text(`Total General: $${total.toFixed(2)}`, 14, finalY + 15);

            // Descargar el PDF
            doc.save('carrito-emmafireworks.pdf');
        });
    }
});
