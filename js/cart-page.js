document.addEventListener('DOMContentLoaded', () => {
    const cartSummaryContainer = document.getElementById('cart-summary-container');
    const generatePdfButton = document.getElementById('generate-pdf-button');

    const cart = JSON.parse(localStorage.getItem('emmaFireworksCart')) || [];

    function renderCartSummary() {
        if (cart.length === 0) {
            cartSummaryContainer.innerHTML = '<p class="text-gray-500 text-center">Tu carrito está vacío.</p>';
            generatePdfButton.disabled = true;
            return;
        }

        let total = 0;
        let summaryHtml = '<table class="w-full text-left"><thead><tr><th class="p-2">Producto</th><th class="p-2">Cantidad</th><th class="p-2">Precio</th><th class="p-2">Subtotal</th></tr></thead><tbody>';

        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            summaryHtml += `
                <tr>
                    <td class="p-2">${item.name}</td>
                    <td class="p-2">${item.quantity}</td>
                    <td class="p-2">$${item.price.toFixed(2)}</td>
                    <td class="p-2">$${subtotal.toFixed(2)}</td>
                </tr>
            `;
            total += subtotal;
        });

        summaryHtml += `</tbody><tfoot><tr><td colspan="3" class="text-right p-2 font-bold">Total:</td><td class="p-2 font-bold">$${total.toFixed(2)}</td></tr></tfoot></table>`;
        cartSummaryContainer.innerHTML = summaryHtml;
    }

    if (generatePdfButton) {
        generatePdfButton.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Título principal
            doc.setFontSize(18);
            doc.setTextColor(255, 0, 0); // Rojo para "Emma Fireworks"
            doc.text("Emma Fireworks", 105, 20, { align: "center" });

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text("Nombre: " + name, 14, 30);
            doc.text("Teléfono: " + phone, 14, 36);
            doc.text("Dirección: " + address, 14, 42);

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

            doc.autoTable(tableColumn, tableRows, { startY: 50 });

            const finalY = doc.autoTable.previous.finalY;

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`Total General: $${total.toFixed(2)}`, doc.internal.pageSize.getWidth() - 14, finalY + 15, { align: 'right' });

            doc.save('resumen-pedido-emmafireworks.pdf');

            localStorage.removeItem('emmaFireworksCart');
            window.location.href = 'catalogo.html';
        });
    }

    renderCartSummary();
});
