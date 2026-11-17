
// Store Information
const unitPrice = 250;
let availableStock = 20;
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


// Order Form Validation

const orderForm = document.getElementById("order-form");

orderForm.addEventListener("submit", function (event) {

    // Prevent page reload
    event.preventDefault();

    // Get customer information
    const customerName = document.getElementById("customer-name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const hall = document.getElementById("hall").value;

    // Validate name
    if (customerName.length < 2) {
        alert("Please enter your full name.");
        return;
    }

    // Validate Bangladesh mobile number
    const mobilePattern = /^01[3-9]\d{8}$/;

    if (!mobilePattern.test(mobile)) {
        alert("Please enter a valid Bangladeshi mobile number.");
        return;
    }

    // Validate hall
    if (hall === "") {
        alert("Please select your hall.");
        return;
    }

    // Validate stock
    if (quantity < 1 || quantity > availableStock) {
        alert("Sorry! Requested quantity is not available.");
        return;
    }

    // Calculate total
    const totalPrice = quantity * unitPrice;

    // Demo confirmation
    alert(
        "Order information is valid!\n\n" +
        "Name: " + customerName + "\n" +
        "Mobile: " + mobile + "\n" +
        "Hall: " + hall + "\n" +
        "Quantity: " + quantity + "\n" +
        "Total: ৳" + totalPrice
    );

});
