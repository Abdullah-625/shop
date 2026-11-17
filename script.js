
/* =================================
   1. STORE INFORMATION
================================= */

let unitPrice = 0;
let availableStock = 0;
let quantity = 1;
let productLoaded = false;

async function loadProductInfo() {
  const apiURL = "https://script.google.com/macros/s/AKfycbzDd2WVaNUF42tnP5US_KvBG3TZF4pIWa9ncwRfbtrXRXhplHqsFRhTkD8BZqk219Y/exec?action=getProduct";

  try {
    const response = await fetch(apiURL);
    const product = await response.json();

    if (!product.success || product.status !== "ACTIVE") {
      throw new Error("Product is unavailable");
    }

    unitPrice = Number(product.price);
    availableStock = Number(product.stock);

    document.getElementById("unit-price").textContent = unitPrice;

    updateDisplay();

    if (!productLoaded) return;

    console.log("Product loaded:", product);

  } catch (error) {
    console.error("Backend Error:", error);
    alert("Unable to load product information. Please try again.");
  }
}

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


/* =================================
   3. UPDATE PRODUCT DISPLAY
================================= */


function updateDisplay() {

    // Wait until product information is loaded
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
}



/* =================================
   4. QUANTITY CONTROL
================================= */

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


/* =================================
   5. ORDER ID GENERATOR
================================= */

function generateOrderID(hallCode) {

    const now = new Date();

    // Date format: MMDD
    const date =
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0");

    // Random 3-digit number
    const randomNumber =
        Math.floor(100 + Math.random() * 900);

    // Example: CX62D1117483
    return "CX" + hallCode + "D" + date + randomNumber;
}


/* =================================
   6. ORDER FORM VALIDATION
================================= */

orderForm.addEventListener("submit", function (event) {

    event.preventDefault();

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


    /* =================================
       7. GENERATE ORDER INFORMATION
    ================================= */

    // Temporary Demo Hall Codes
    // Replace these with actual hall codes later.

    const hallCodeMap = {
        "Demo Hall 1": "61",
        "Demo Hall 2": "62",
        "Demo Hall 3": "41"
    };

    const hallCode = hallCodeMap[hall];

    if (!hallCode) {
        alert("Hall code is not configured yet.");
        return;
    }

    // Generate Order ID
    const orderID = generateOrderID(hallCode);

    // Calculate Total
    const totalPrice = quantity * unitPrice;


    /* =================================
       8. SHOW ORDER CONFIRMATION
    ================================= */

    document.getElementById("confirmed-order-id").textContent = orderID;

    document.getElementById("confirmed-name").textContent =
        customerName;

    document.getElementById("confirmed-mobile").textContent =
        mobile;

    document.getElementById("confirmed-hall").textContent =
        hallName;

    document.getElementById("confirmed-quantity").textContent =
        quantity + " Pigeon(s)";

    document.getElementById("confirmed-total").textContent =
        totalPrice;


    // Hide Store Sections
    document.querySelector(".product").hidden = true;

    document.querySelector(".checkout").hidden = true;


    // Show Confirmation Screen
    const confirmation =
        document.getElementById("confirmation");

    confirmation.hidden = false;

    confirmation.scrollIntoView({
        behavior: "smooth"
    });

});


/* =================================
   9. BACK TO STORE
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


async function loadProductInfo() {

    const apiURL = "https://script.google.com/macros/s/AKfycbzDd2WVaNUF42tnP5US_KvBG3TZF4pIWa9ncwRfbtrXRXhplHqsFRhTkD8BZqk219Y/exec?action=getProduct";

    try {

        const response = await fetch(apiURL);
        const product = await response.json();

        if (!product.success || product.status !== "ACTIVE") {
            throw new Error("Product is unavailable");
        }

        unitPrice = Number(product.price);
        availableStock = Number(product.stock);

        document.getElementById("unit-price").textContent = unitPrice;

        // Product information is now ready
        productLoaded = true;

        updateDisplay();

        console.log("Product loaded:", product);

    } catch (error) {

        console.error("Backend Error:", error);

        document.getElementById("unit-price").textContent = "Unavailable";
        document.getElementById("stock").textContent = "Unavailable";
        document.getElementById("stock-status").textContent = "Connection Error";

    }
}
