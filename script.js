document.addEventListener("DOMContentLoaded", function () {

let cart = [];

const bagButtons = document.querySelectorAll(".bag-button");
const headerBag = document.querySelector('.header-icons button[aria-label="Shopping Bag"]');

// Create shopping bag panel
const overlay = document.createElement("div");
overlay.className = "cart-overlay"

const cartPanel = document.createElement("div");
cartPanel.className = "cart-panel"

cartPanel.innerHTML = `
<div class="cart-header">
<h2>Your Shopping Bag</h2>
<button class="cart-close">×</button>
</div>

<div class="cart-items">
<p class="empty-cart">Your bag is empty.</p>
</div>

<div class="cart-footer">
<div class="cart-total">
<span>Total</span>
<strong>GH₵ 0</strong>
</div>

<button class="checkout-button">
CHECKOUT
</button>
</div>
`;

document.body.appendChild(overlay);
document.body.appendChild(cartPanel);

const cartItems = cartPanel.querySelector(".cart-items");
const cartTotal = cartPanel.querySelector(".cart-total strong");
const closeButton = cartPanel.querySelector(".cart-close");
const checkoutButton = cartPanel.querySelector(".checkout-button");

// Open cart
function openCart() {
cartPanel.classList.add("open");
overlay.classList.add("show");
}

// Close cart
function closeCart() {
cartPanel.classList.remove("open");
overlay.classList.remove("show");
}

closeButton.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// Get product information
function getProduct(card) {

const name = card.querySelector("h3").textContent.trim();
const priceText = card.querySelector(".price").textContent
.replace("GH₵", "")
.replace(",", "")
.trim();

const price = Number(priceText);

const image = card.querySelector("img").getAttribute("src");

return {
name: name,
price: price,
image: image
};
}

// Add product to cart
bagButtons.forEach(function (button) {

button.addEventListener("click", function () {

const card = button.closest(".product-card");
const product = getProduct(card);

cart.push(product);

updateCart();
openCart();
});

});

// Header bag button
if (headerBag) {
headerBag.addEventListener("click", openCart);
}

// Update cart
function updateCart() {

if (cart.length === 0) {

cartItems.innerHTML = `
<p class="empty-cart">
Your bag is empty.
</p>
`;

} else {

cartItems.innerHTML = cart.map(function (product, index) {

return `
<div class="cart-item">

<img src="${product.image}" alt="${product.name}">

<div class="cart-item-info">
<h3>${product.name}</h3>
<p>GH₵ ${product.price.toLocaleString()}</p>

<button class="remove-item" data-index="${index}">
Remove
</button>
</div>

</div>
`;

}).join("");

}

const total = cart.reduce(function (sum, product) {
return sum + product.price;
}, 0);

cartTotal.textContent = `GH₵ ${total.toLocaleString()}`;

// Remove buttons
document.querySelectorAll(".remove-item").forEach(function (button) {

button.addEventListener("click", function () {

const index = Number(button.dataset.index);

cart.splice(index, 1);

updateCart();
});

});

}

// Checkout
checkoutButton.addEventListener("click", function () {

if (cart.length === 0) {
alert("Your shopping bag is empty.");
return;
}

alert("Your order is ready for checkout. We will connect this to WhatsApp next.");

});

});
