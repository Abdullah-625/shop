
// Store Information
const unitPrice = 250;
let availableStock = 5;
let quantity = 1;

// HTML Elements
const quantityDisplay = document.getElementById("quantity");
const stockDisplay = document.getElementById("stock");
const totalPriceDisplay = document.getElementById("total-price");
const stockStatus = document.getElementById("stock-status");

const increaseButton = document.getElementById("increase");
const decreaseButton = document.getElementById("decrease");

// Update Website Display
function updateDisplay() {
    quantityDisplay.textContent = quantity;
    stockDisplay.textContent = availableStock;

    totalPriceDisplay.textContent = quantity * unitPrice;

    if (availableStock === 0) {
        stockStatus.textContent = "Out of Stock";
        stockStatus.style.color = "red";
    } else {
        stockStatus.textContent = "In Stock";
        stockStatus.style.color = "green";
    }

    increaseButton.disabled = quantity >= availableStock || availableStock === 0;
    decreaseButton.disabled = quantity <= 1;
}

// Increase Quantity
increaseButton.addEventListener("click", function () {
    if (quantity < availableStock) {
        quantity++;
        updateDisplay();
    }
});

// Decrease Quantity
decreaseButton.addEventListener("click", function () {
    if (quantity > 1) {
        quantity--;
        updateDisplay();
    }
});

// Initial Display
updateDisplay();
