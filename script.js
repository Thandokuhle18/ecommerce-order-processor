
"use strict";

// CHALLENGE 1: Clean customer names using String

function cleanCustomerNames() {
    for (let i = 0; i < orders.length; i++) {
        orders[i].customerName = orders[i].customerName.trim();
    }
}

// CHALLENGE 2: Calculate order totals using Number and Math

function calculateOrderTotal(order) {
    let price = Number(order.price);
    let quantity = Number(order.quantity);

    let total = price * quantity;

    // Round the total to two decimal places.
    return Math.round(total * 100) / 100;
}

// Format prices as South African Rand.
function formatPrice(price) {
    return "R" + Number(price).toFixed(2);
}

// CHALLENGE 3: Work with dates using Date

function formatOrderDate(dateString) {
    let date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleDateString("en-ZA");
}

// CHALLENGE 4: Process orders using Array methods

function getCompletedOrders() {
    return orders.filter(function(order) {
        return order.status === "Completed";
    });
}

function getPendingOrders() {
    return orders.filter(function(order) {
        return order.status === "Pending";
    });
}

function getTotalRevenue() {
    let completedOrders = getCompletedOrders();

    return completedOrders.reduce(function(total, order) {
        return total + calculateOrderTotal(order);
    }, 0);
}

function getTotalOrders() {
    return orders.length;
}

// CHALLENGE 5: Get unique categories using Set

function getCategories() {
    let categories = new Set();

    orders.forEach(function(order) {
        categories.add(order.category);
    });

    return Array.from(categories);
}

// CHALLENGE 6: Find products using Map

let productPrices = new Map();

function buildProductMap() {
    productPrices.clear();

    orders.forEach(function(order) {
        productPrices.set(order.product, Number(order.price));
    });
}

function findProductPrice(productName) {
    if (productPrices.has(productName)) {
        return productPrices.get(productName);
    }

    return null;
}

// CHALLENGE 7: Save and load orders using JSON

function exportOrders() {
    let orderData = JSON.stringify(orders, null, 2);

    let file = new Blob([orderData], {
        type: "application/json"
    });

    let downloadLink = document.createElement("a");

    downloadLink.href = URL.createObjectURL(file);
    downloadLink.download = "orders.json";
    downloadLink.click();

    URL.revokeObjectURL(downloadLink.href);
}

function importOrders(file) {
    let reader = new FileReader();

    reader.onload = function(event) {
        try {
            let importedOrders = JSON.parse(event.target.result);

            if (Array.isArray(importedOrders)) {
                orders = importedOrders;

                cleanCustomerNames();
                buildProductMap();
                displayOrders();
                displayStatistics();
                displayCategories();

                alert("Orders imported successfully.");
            } else {
                alert("The file must contain a list of orders.");
            }
        } catch (error) {
            alert("Could not read the file. Please select a valid JSON file.");
        }
    };

    reader.readAsText(file);
}

// CHALLENGE 8: Validate email addresses using RegExp

function isValidEmail(email) {
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}

function validateOrder(order) {
    if (order.orderId === "") {
        return false;
    }

    if (!isValidEmail(order.email)) {
        return false;
    }

    if (Number(order.quantity) <= 0) {
        return false;
    }

    if (Number(order.price) < 0) {
        return false;
    }

    return true;
}

// Display the orders on the page.

function displayOrders() {
    let orderList = document.getElementById("orderList");

    if (!orderList) {
        return;
    }

    orderList.innerHTML = "";

    orders.forEach(function(order) {
        let orderTotal = calculateOrderTotal(order);
        let validOrder = validateOrder(order);

        let orderCard = document.createElement("div");
        orderCard.className = "bg-white p-4 rounded-lg shadow mb-4";

        let orderTitle = document.createElement("h3");
        orderTitle.className = "font-bold text-lg";
        orderTitle.textContent = order.orderId + " - " + order.customerName;

        let orderDetails = document.createElement("p");
        orderDetails.textContent =
            "Product: " + order.product +
            " | Quantity: " + order.quantity;

        let orderPrice = document.createElement("p");
        orderPrice.textContent = "Total: " + formatPrice(orderTotal);

        let orderStatus = document.createElement("p");
        orderStatus.textContent =
            "Status: " + order.status +
            " | Date: " + formatOrderDate(order.orderDate);

        let validationMessage = document.createElement("p");

        if (validOrder) {
            validationMessage.textContent = "Order details are valid.";
            validationMessage.className = "text-green-600";
        } else {
            validationMessage.textContent = "Order details are invalid.";
            validationMessage.className = "text-red-600";
        }

        orderCard.appendChild(orderTitle);
        orderCard.appendChild(orderDetails);
        orderCard.appendChild(orderPrice);
        orderCard.appendChild(orderStatus);
        orderCard.appendChild(validationMessage);

        orderList.appendChild(orderCard);
    });
}

// Display summary information.

function displayStatistics() {
    let totalOrders = document.getElementById("totalOrders");
    let pendingOrders = document.getElementById("pendingOrders");
    let completedOrders = document.getElementById("completedOrders");
    let totalRevenue = document.getElementById("totalRevenue");

    if (totalOrders) {
        totalOrders.textContent = getTotalOrders();
    }

    if (pendingOrders) {
        pendingOrders.textContent = getPendingOrders().length;
    }

    if (completedOrders) {
        completedOrders.textContent = getCompletedOrders().length;
    }

    if (totalRevenue) {
        totalRevenue.textContent = formatPrice(getTotalRevenue());
    }
}

// Display the available categories.

function displayCategories() {
    let categoryList = document.getElementById("categoryList");

    if (!categoryList) {
        return;
    }

    categoryList.innerHTML = "";

    let categories = getCategories();

    categories.forEach(function(category) {
        let categoryItem = document.createElement("span");
        categoryItem.className =
            "inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded mr-2 mb-2";

        categoryItem.textContent = category;
        categoryList.appendChild(categoryItem);
    });
}

// Search orders by customer name or order ID.

function searchOrders() {
    let searchInput = document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    let searchText = searchInput.value.toLowerCase().trim();

    let matchingOrders = orders.filter(function(order) {
        let customerName = order.customerName.toLowerCase();
        let orderId = order.orderId.toLowerCase();

        return customerName.includes(searchText) ||
            orderId.includes(searchText);
    });

    displayOrderResults(matchingOrders);
}

// Filter orders by status.

function filterOrders() {
    let statusFilter = document.getElementById("statusFilter");

    if (!statusFilter) {
        return;
    }

    let selectedStatus = statusFilter.value;

    let matchingOrders = orders.filter(function(order) {
        if (selectedStatus === "All") {
            return true;
        }

        return order.status === selectedStatus;
    });

    displayOrderResults(matchingOrders);
}

// Display search and filter results.

function displayOrderResults(orderResults) {
    let orderList = document.getElementById("orderList");

    if (!orderList) {
        return;
    }

    orderList.innerHTML = "";

    orderResults.forEach(function(order) {
        let orderCard = document.createElement("div");
        orderCard.className = "bg-white p-4 rounded-lg shadow mb-4";

        let orderTitle = document.createElement("h3");
        orderTitle.className = "font-bold text-lg";
        orderTitle.textContent = order.orderId + " - " + order.customerName;

        let orderDetails = document.createElement("p");
        orderDetails.textContent =
            "Product: " + order.product +
            " | Quantity: " + order.quantity;

        let orderPrice = document.createElement("p");
        orderPrice.textContent =
            "Total: " + formatPrice(calculateOrderTotal(order));

        let orderStatus = document.createElement("p");
        orderStatus.textContent = "Status: " + order.status;

        orderCard.appendChild(orderTitle);
        orderCard.appendChild(orderDetails);
        orderCard.appendChild(orderPrice);
        orderCard.appendChild(orderStatus);

        orderList.appendChild(orderCard);
    });
}

// Look up a product's price.

function searchProduct() {
    let productInput = document.getElementById("productInput");
    let productResult = document.getElementById("productResult");

    if (!productInput || !productResult) {
        return;
    }

    let productName = productInput.value.trim();
    let price = findProductPrice(productName);

    if (price !== null) {
        productResult.textContent =
            productName + " costs " + formatPrice(price);
    } else {
        productResult.textContent = "Product not found.";
    }
}

// Connect buttons and inputs to their functions.

function connectEvents() {
    let searchButton = document.getElementById("searchButton");
    let statusFilter = document.getElementById("statusFilter");
    let productButton = document.getElementById("productButton");
    let exportButton = document.getElementById("exportButton");
    let importInput = document.getElementById("importInput");

    if (searchButton) {
        searchButton.addEventListener("click", searchOrders);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", filterOrders);
    }

    if (productButton) {
        productButton.addEventListener("click", searchProduct);
    }

    if (exportButton) {
        exportButton.addEventListener("click", exportOrders);
    }

    if (importInput) {
        importInput.addEventListener("change", function() {
            if (importInput.files.length > 0) {
                importOrders(importInput.files[0]);
            }
        });
    }
}

// Start the application.

function startApplication() {
    cleanCustomerNames();
    buildProductMap();

    displayOrders();
    displayStatistics();
    displayCategories();

    connectEvents();
}

document.addEventListener("DOMContentLoaded", startApplication);
