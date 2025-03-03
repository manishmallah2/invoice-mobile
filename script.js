let items = [];

function addItem() {
    let itemName = document.getElementById("itemName").value;
    let qty = document.getElementById("qty").value;
    let pricePerKg = document.getElementById("pricePerKg").value;

    if (!itemName || !qty || !pricePerKg) {
        alert("Please fill all fields!");
        return;
    }

    let totalPrice = qty * pricePerKg;
    items.push({ itemName, qty, pricePerKg, totalPrice });

    updateTable();
    updateSubtotal();
    document.getElementById("itemName").value = "";
    document.getElementById("qty").value = "";
    document.getElementById("pricePerKg").value = "";
}

function updateTable() {
    let tableBody = document.querySelector("#invoiceTable tbody");
    tableBody.innerHTML = "";

    items.forEach(item => {
        let row = `<tr>
            <td>${item.itemName}</td>
            <td>${item.qty}</td>
            <td>₹${item.pricePerKg}</td>
            <td>₹${item.totalPrice}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function updateSubtotal() {
    let subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    document.getElementById("subtotal").innerText = subtotal;
    updateGrandTotal();
}

function updateGrandTotal() {
    let subtotal = parseFloat(document.getElementById("subtotal").innerText);
    let remainingBalance = parseFloat(document.getElementById("remainingBalance").value) || 0;
    document.getElementById("grandTotal").innerText = subtotal + remainingBalance;
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(255, 51, 102);
    doc.text("GKM ENTERPRISE", 10, 10);
    doc.setFontSize(14);
    doc.setTextColor(0, 204, 153);
    doc.text("Invoice", 10, 20);

    // Items
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = 35;

    items.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.itemName} - ${item.qty} kgs × ₹${item.pricePerKg} = ₹${item.totalPrice}`, 10, y);
        y += 10;
    });

    // Summary
    let subtotal = document.getElementById("subtotal").innerText;
    let remainingBalance = document.getElementById("remainingBalance").value || 0;
    let grandTotal = document.getElementById("grandTotal").innerText;

    doc.setFontSize(14);
    y += 15;
    doc.setTextColor(0, 204, 153);
    doc.text(`Subtotal: ₹${subtotal}`, 10, y);
    y += 10;
    doc.text(`Previous Balance: ₹${remainingBalance}`, 10, y);
    y += 10;
    doc.setTextColor(255, 51, 102);
    doc.text(`Grand Total: ₹${grandTotal}`, 10, y);

    doc.save("GKM_Invoice.pdf");
}