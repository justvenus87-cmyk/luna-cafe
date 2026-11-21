let cart = [];


function addToCart(name, price) {
    let existingItem = cart.find(function(item) {
        return item.name === name;
    });
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    updateCart();
    showAddedMessage(name);
}
function showAddedMessage(name) {
    let message = document.createElement("div");
    message.textContent =
        name + " به سبد خرید اضافه شد";
    message.classList.add("added-message");
    document.body.appendChild(message);
    setTimeout(function() {
        message.classList.add("show");
    }, 10);
    setTimeout(function() {
        message.classList.remove("show");
        setTimeout(function() {
            message.remove();
        }, 300);
    }, 2000);
}
function showEmptyCartMessage() {
    let message = document.createElement("div");
    message.textContent =
        "سبد خرید شما خالی است";
    message.classList.add("added-message");
    document.body.appendChild(message);
    setTimeout(function() {
        message.classList.add("show");
    }, 10);
    setTimeout(function() {
        message.classList.remove("show");
        setTimeout(function() {
            message.remove();
        }, 300);
    }, 2000);
}
function updateCart() {
    let cartItems =
        document.getElementById("cart-items");
    cartItems.innerHTML = "";
    if (cart.length === 0) {
        cartItems.innerHTML =
            "<p>سبد خرید شما خالی است.</p>";
        document.getElementById("cart-total").textContent =
            "۰ تومان";
        updateCartCount();
        updateOrderSummary();
        return;
    }
    cart.forEach(function(item, index) {
        let itemElement =
            document.createElement("div");
        itemElement.innerHTML = `
            <span>
                ${item.name}
            </span>
            <span>
                <button onclick="decreaseQuantity(${index})">
                    ➖
                </button>
                <span>
                    ${item.quantity}
                </span>
                <button onclick="increaseQuantity(${index})">
                    ➕
                </button>
            </span>
            <span>
                ${(item.price * item.quantity).toLocaleString()}
                تومان
                <button onclick="removeFromCart(${index})">
                    🗑️
                </button>
            </span>
        `;
        cartItems.appendChild(itemElement);
    });
    let total = 0;
    cart.forEach(function(item) {
        total +=
            item.price * item.quantity;
    });
    document.getElementById("cart-total").textContent =
        total.toLocaleString() + " تومان";
    updateCartCount();
    updateOrderSummary();
}
function updateOrderSummary() {
    let summaryItems =
        document.getElementById("order-summary-items");
    let summaryTotal =
        document.getElementById("order-summary-total");
    if (!summaryItems || !summaryTotal) {
        return;
    }
    summaryItems.innerHTML = "";
    if (cart.length === 0) {
        summaryItems.innerHTML =
            "<p>هنوز محصولی انتخاب نشده است.</p>";
        summaryTotal.textContent =
            "۰ تومان";
        return;
    }
    let total = 0;
    cart.forEach(function(item) {
        let itemTotal =
            item.price * item.quantity;
        total += itemTotal;
        let summaryItem =
            document.createElement("div");
        summaryItem.classList.add(
            "order-summary-item"
        );
        summaryItem.innerHTML = `
            <span>
                ${item.name} × ${item.quantity}
            </span>
            <span>
                ${itemTotal.toLocaleString()} تومان
            </span>
        `;
        summaryItems.appendChild(summaryItem);
    });
    summaryTotal.textContent =
        total.toLocaleString() + " تومان";
}
function updateCartCount() {
    let count = 0;
    cart.forEach(function(item) {
        count += item.quantity;
    });
    let cartCount =
        document.getElementById("cart-count");
    cartCount.textContent = count;
    cartCount.classList.remove("cart-bump");
    void cartCount.offsetWidth;
    cartCount.classList.add("cart-bump");
}
function increaseQuantity(index) {
    cart[index].quantity++;
    updateCart();
}
function decreaseQuantity(index) {
    cart[index].quantity--;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
}
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}
/* ادامه سفارش */
document
    .querySelector(".continue-order-btn")
    .addEventListener("click", function(event) {
        if (cart.length === 0) {
            event.preventDefault();
            showEmptyCartMessage();
            return;
        }
        updateOrderSummary();
    });
/* بستن پیام موفقیت */
function closeSuccessMessage() {
    let successMessage =
        document.getElementById("success-message");
    successMessage.classList.remove("show");
}
/* ساخت شماره سفارش */
function generateOrderNumber() {
    let number =
        Math.floor(1000 + Math.random() * 9000);
    return "#LUNA-" + number;
}
/* گرفتن تاریخ امروز */
function getOrderDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(
        today.getMonth() + 1
    ).padStart(2, "0");
    let day = String(
        today.getDate()
    ).padStart(2, "0");
    return year + "/" + month + "/" + day;
}
/* ثبت نهایی سفارش */
document
    .getElementById("order-form")
    .addEventListener("submit", function(event) {
        event.preventDefault();
        if (cart.length === 0) {
            showEmptyCartMessage();
            return;
        }
        let customerName =
            document.getElementById("customer-name").value;
        let customerPhone =
            document.getElementById("customer-phone").value;
        let customerAddress =
            document.getElementById("customer-address").value;
        let paymentMethod =
            document.getElementById("payment-method").value;
        let orderNote =
            document.getElementById("order-note").value;
        let total = 0;
        cart.forEach(function(item) {
            total +=
                item.price * item.quantity;
        });
        let orderNumber =
            generateOrderNumber();
        let orderDate =
            getOrderDate();
        /*
         * اطلاعات سفارش در این مرحله آماده شده‌اند.
         * بعداً می‌توانیم آن‌ها را به سیستم واقعی
         * ثبت سفارش یا بک‌اند وصل کنیم.
         */
        cart = [];
        updateCart();
        document
            .getElementById("order-form")
            .reset();
        let successMessage =
            document.getElementById("success-message");
        successMessage.querySelector("p").innerHTML = `
            ممنون که Luna Café رو انتخاب کردی ♡
            <br><br>
            <strong>
                شماره سفارش:
            </strong>
            ${orderNumber}
            <br>
            <strong>
                تاریخ:
            </strong>
            ${orderDate}
        `;
        successMessage.classList.add("show");
    });