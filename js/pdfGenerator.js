document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.getElementById('checkout-button');

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const cart = JSON.parse(localStorage.getItem('emmaFireworksCart')) || [];

            // Título principal
  doc.setFontSize(18);
  doc.setTextColor(255, 0, 0); // Rojo para "Emma Fireworks"
  doc.text('Emma Fireworks', 105, 20, { align: 'center' });

  // Subtítulo
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0); // Negro
  doc.text('Resumen del carrito de compras', 105, 30, { align: 'center' });

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

            doc.autoTable(tableColumn, tableRows, { startY: 40 });

            const finalY = doc.autoTable.previous.finalY;

            // Total General
            doc.setFontSize(14);
            doc.text(`Total General: $${total.toFixed(2)}`, 14, finalY + 15);

            // Descargar el PDF
            doc.save('carrito-emmafireworks.pdf');
        });
    }
});
