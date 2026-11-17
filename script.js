
/* =================================
   1. STORE INFORMATION
================================= */

let unitPrice = 0;
let availableStock = 0;
let quantity = 1;
let productLoaded = false;

const apiURL = "https://script.google.com/macros/s/AKfycbzDd2WVaNUF42tnP5US_KvBG3TZF4pIWa9ncwRfbtrXRXhplHqsFRhTkD8BZqk219Y/exec?action=getProduct";


/* =================================
   2. HTML ELEMENTS
================================= */

const quantityDisplay = document.getElementById("quantity");
const stockDisplay = document.getElementById("stock");
const totalPriceDisplay = document.getElementById("total-price");
const stockStatus = document.getElementById("stock-status");

const increaseButton = document.getElementById("increase");
const decreaseButton = document.getElementById("decrease");

const orderForm = document.getElementById("order-form");
const submitButton = orderForm.querySelector('[type="submit"]');


/* =================================
   3. LOAD PRODUCT INFORMATION
================================= */

increaseButton.disabled = true;
decreaseButton.disabled = true;
submitButton.disabled = true;

async function loadProductInfo() {

    console.log("Loading product information...");

    try {

        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("Server response error: " + response.status);
        }

        const product = await response.json();

        console.log("Product data:", product);

        if (!product.success || product.status !== "ACTIVE") {
            throw new Error("Product is unavailable");
        }

        unitPrice = Number(product.price);
        availableStock = Number(product.stock);

        if (!Number.isFinite(unitPrice) || !Number.isFinite(availableStock)) {
            throw new Error("Invalid product information");
        }

        productLoaded = true;

        document.getElementById("unit-price").textContent = unitPrice;

        updateDisplay();

        console.log("Product loaded successfully!");

    } catch (error) {

        console.error("Backend Error:", error);

        document.getElementById("unit-price").textContent = "Unavailable";
        stockDisplay.textContent = "Unavailable";
        stockStatus.textContent = "Connection Error";

        increaseButton.disabled = true;
        decreaseButton.disabled = true;
        submitButton.disabled = true;

    }
}


/* =================================
   4. UPDATE PRODUCT DISPLAY
================================= */

function updateDisplay() {

    if (!productLoaded) return;

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

    increaseButton.disabled =
        quantity >= availableStock || availableStock === 0;

    decreaseButton.disabled = quantity <= 1;

    submitButton.disabled = availableStock === 0;
}


/* =================================
   5. QUANTITY CONTROL
================================= */

// Increase Quantity
increaseButton.addEventListener("click", function () {

    if (productLoaded && quantity < availableStock) {

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


/* =================================
   6. ORDER SUBMISSION
================================= */

orderForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    if (!productLoaded) {
        alert("Product information is still loading. Please wait.");
        return;
    }

    // Customer Information
    const customerName =
        document.getElementById("customer-name").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    const hallSelect = document.getElementById("hall");

    const hall = hallSelect.value;

    const hallName =
        hallSelect.options[hallSelect.selectedIndex].text;


    // Validate Name
    if (customerName.length < 2) {
        alert("Please enter your full name.");
        return;
    }


    // Validate Bangladesh Mobile Number
    const mobilePattern = /^01[3-9]\d{8}$/;

    if (!mobilePattern.test(mobile)) {
        alert("Please enter a valid Bangladeshi mobile number.");
        return;
    }


    // Validate Hall
    if (hall === "") {
        alert("Please select your hall.");
        return;
    }


    // Validate Stock
    if (quantity < 1 || quantity > availableStock) {
        alert("Sorry! Requested quantity is not available.");
        return;
    }


    // Prepare Order Information
    const orderData = {
        action: "submitOrder",
        customerName: customerName,
        mobile: mobile,
        hall: hall,
        hallName: hallName,
        quantity: quantity
    };


    // Disable Button During Processing
    submitButton.disabled = true;
    submitButton.textContent = "Processing Order...";


    try {

        const response = await fetch(apiURL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify(orderData)

        });


        const result = await response.json();

        console.log("Order Response:", result);


        if (!result.success) {
            throw new Error(result.message || "Order failed.");
        }


        // Update Remaining Stock
        availableStock = Number(result.remainingStock);

        quantity = 1;

        updateDisplay();


        // Show Order Information
        document.getElementById("confirmed-order-id").textContent =
            result.orderID;

        document.getElementById("confirmed-name").textContent =
            result.customerName;

        document.getElementById("confirmed-mobile").textContent =
            result.mobile;

        document.getElementById("confirmed-hall").textContent =
            result.hall;

        document.getElementById("confirmed-quantity").textContent =
            result.quantity + " Pigeon(s)";

        document.getElementById("confirmed-total").textContent =
            result.totalPrice;


        // Hide Store Sections
        document.querySelector(".product").hidden = true;
        document.querySelector(".checkout").hidden = true;


        // Show Confirmation Screen
        const confirmation = document.getElementById("confirmation");

        confirmation.hidden = false;

        confirmation.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error("Order Error:", error);

        alert("Order could not be placed: " + error.message);


    } finally {

        submitButton.textContent = "Place Order — Cash on Delivery";

        submitButton.disabled =
            !productLoaded || availableStock === 0;

    }

});


/* =================================
   7. BACK TO STORE
================================= */

document.getElementById("new-order").addEventListener("click", function () {

    // Hide Confirmation
    document.getElementById("confirmation").hidden = true;


    // Show Store
    document.querySelector(".product").hidden = false;
    document.querySelector(".checkout").hidden = false;


    // Reset Form
    orderForm.reset();


    // Reset Quantity
    quantity = 1;

    updateDisplay();


    // Return to Top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =================================
   8. START APPLICATION
================================= */

loadProductInfo();
