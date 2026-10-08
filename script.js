document.addEventListener("DOMContentLoaded", function () {

/* =========================================================
MOBILE MENU
========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", function () {
    navigation.classList.toggle("mobile-open");
  });
}


/* =========================================================
CATEGORY FILTER
========================================================= */

const categoryButtons = document.querySelectorAll(".category");
const productCards = document.querySelectorAll(".product-card");

categoryButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    categoryButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const selectedCategory =
      button.getAttribute("data-category");

    productCards.forEach(function (card) {

      const cardCategory =
        card.getAttribute("data-category");

      if (
        selectedCategory === "all" ||
        selectedCategory === cardCategory
      ) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }

    });

  });

});


/* =========================================================
PRODUCT INFORMATION
========================================================= */

function getProduct(card) {

  const name =
    card.querySelector("h3")?.textContent.trim() || "";

  const priceText =
    card.querySelector(".price")?.textContent || "0";

  const price =
    parseFloat(
      priceText.replace(/[^0-9.]/g, "")
    ) || 0;

  const image =
    card.querySelector("img")?.getAttribute("src") || "";

  return {
    name: name,
    price: price,
    image: image
  };

}


/* =========================================================
SHOPPING BAG
========================================================= */

let cart = [];


function addProductToCart(product, size = "") {

  const existing =
    cart.find(function (item) {

      return (
        item.name === product.name &&
        item.size === size
      );

    });


  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      name: product.name,
      price: product.price,
      image: product.image,
      size: size,
      quantity: 1
    });

  }

  updateCart();

}


function updateCart() {

  const cartItems =
    document.querySelector(".cart-items");

  const cartTotal =
    document.querySelector(".cart-total strong");

  if (!cartItems) return;


  if (cart.length === 0) {

    cartItems.innerHTML =
      '<p class="empty-cart">Your shopping bag is empty.</p>';

    if (cartTotal) {
      cartTotal.textContent = "GH₵ 0";
    }

    return;
  }


  let total = 0;


  cartItems.innerHTML =
    cart.map(function (item, index) {

      const itemTotal =
        item.price * item.quantity;

      total += itemTotal;


      return `
        <div class="cart-item">

          <img
            src="${item.image}"
            alt="${item.name}"
          >

          <div class="cart-item-info">

            <h3>${item.name}</h3>

            ${
              item.size
                ? `<p>Size: ${item.size}</p>`
                : ""
            }

            <p>
              GH₵ ${item.price}
            </p>

            <div class="cart-quantity">

              <button
                class="quantity-minus"
                data-index="${index}"
                type="button"
              >
                −
              </button>

              <span>${item.quantity}</span>

              <button
                class="quantity-plus"
                data-index="${index}"
                type="button"
              >
                +
              </button>

            </div>

            <button
              class="remove-item"
              data-index="${index}"
              type="button"
            >
              Remove
            </button>

          </div>

        </div>
      `;

    }).join("");


  if (cartTotal) {
    cartTotal.textContent =
      "GH₵ " + total;
  }


  document
    .querySelectorAll(".remove-item")
    .forEach(function (button) {

      button.addEventListener("click", function () {

        const index =
          parseInt(
            button.getAttribute("data-index")
          );

        cart.splice(index, 1);

        updateCart();

      });

    });


  document
    .querySelectorAll(".quantity-minus")
    .forEach(function (button) {

      button.addEventListener("click", function () {

        const index =
          parseInt(
            button.getAttribute("data-index")
          );

        if (!cart[index]) return;

        cart[index].quantity -= 1;

        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }

        updateCart();

      });

    });


  document
    .querySelectorAll(".quantity-plus")
    .forEach(function (button) {

      button.addEventListener("click", function () {

        const index =
          parseInt(
            button.getAttribute("data-index")
          );

        if (!cart[index]) return;

        cart[index].quantity += 1;

        updateCart();

      });

    });

}


/* =========================================================
CREATE SHOPPING BAG
========================================================= */

function createCart() {

  if (document.querySelector(".cart-panel")) {
    return;
  }


  document.body.insertAdjacentHTML(
    "beforeend",

    `
    <div class="cart-overlay"></div>

    <div class="cart-panel">

      <div class="cart-header">

        <h2>SHOPPING BAG</h2>

        <button
          class="cart-close"
          type="button"
          aria-label="Close shopping bag"
        >
          ×
        </button>

      </div>


      <div class="cart-items">

        <p class="empty-cart">
          Your shopping bag is empty.
        </p>

      </div>


      <div class="cart-footer">

        <div class="cart-total">

          <span>TOTAL</span>

          <strong>GH₵ 0</strong>

        </div>


        <button
          class="checkout-button"
          type="button"
        >
          CHECKOUT
        </button>

      </div>

    </div>
    `
  );


  const overlay =
    document.querySelector(".cart-overlay");

  const panel =
    document.querySelector(".cart-panel");

  const closeButton =
    document.querySelector(".cart-close");


  function closeCart() {

    panel.classList.remove("open");
    overlay.classList.remove("show");

  }


  closeButton.addEventListener(
    "click",
    closeCart
  );


  overlay.addEventListener(
    "click",
    closeCart
  );


  /* =====================================================
  CHECKOUT BUTTON
  ===================================================== */

  const checkoutButton =
    document.querySelector(".checkout-button");


  if (checkoutButton) {

    checkoutButton.addEventListener(
      "click",
      function () {

        if (cart.length === 0) {

          alert(
            "Your shopping bag is empty."
          );

          return;

        }


        openCheckout();

      }
    );

  }

}


createCart();


/* =========================================================
CHECKOUT
========================================================= */

function openCheckout() {

  const existing =
    document.querySelector(
      ".venes-checkout-overlay"
    );

  if (existing) {
    return;
  }


  let total = 0;


  cart.forEach(function (item) {

    total +=
      item.price * item.quantity;

  });


  let orderItems = "";


  cart.forEach(function (item) {

    orderItems += `

      <div class="checkout-product">

        <div>

          <strong>
            ${item.name}
          </strong>

          ${
            item.size
              ? `<small>Size: ${item.size}</small>`
              : ""
          }

          <small>
            Quantity: ${item.quantity}
          </small>

        </div>

        <strong>
          GH₵ ${item.price * item.quantity}
        </strong>

      </div>

    `;

  });


  document.body.insertAdjacentHTML(
    "beforeend",

    `

    <div class="venes-checkout-overlay">

      <div class="venes-checkout">

        <button
          class="checkout-close"
          type="button"
          aria-label="Close checkout"
        >
          ×
        </button>


        <h2>
          CHECKOUT
        </h2>


        <p class="checkout-intro">
          Complete your details to place your order.
        </p>


        <div class="checkout-section">

          <h3>
            CUSTOMER INFORMATION
          </h3>


          <label for="checkout-name">
            FULL NAME
          </label>

          <input
            id="checkout-name"
            type="text"
            placeholder="Enter your full name"
          >


          <label for="checkout-phone">
            PHONE NUMBER
          </label>

          <input
            id="checkout-phone"
            type="tel"
            placeholder="Enter your phone number"
          >


          <label for="checkout-location">
            DELIVERY LOCATION
          </label>

          <input
            id="checkout-location"
            type="text"
            placeholder="Enter your delivery location"
          >


          <label for="checkout-notes">
            DELIVERY NOTES
          </label>

          <textarea
            id="checkout-notes"
            placeholder="Optional delivery instructions"
          ></textarea>

        </div>


        <div class="checkout-section">

          <h3>
            YOUR ORDER
          </h3>


          <div class="checkout-products">

            ${orderItems}

          </div>


          <div class="checkout-final-total">

            <span>
              TOTAL
            </span>

            <strong>
              GH₵ ${total}
            </strong>

          </div>

        </div>


        <div class="checkout-section">

          <h3>
            PAYMENT METHOD
          </h3>


          <div class="momo-payment">

            <strong>
              MOBILE MONEY — MTN
            </strong>


            <p>
              You can send payment from any mobile money network.
              Please send payment to our MTN Mobile Money number.
            </p>


            <div class="momo-number">

              <span>
                SEND PAYMENT TO
              </span>

              <strong>
                0559584979
              </strong>

            </div>

          </div>

        </div>


        <button
          class="place-order-button"
          type="button"
        >
          PLACE ORDER
        </button>


        <p class="checkout-note">
          Your order will be sent to Venes Collection via WhatsApp.
        </p>

      </div>

    </div>

    `
  );


  const checkout =
    document.querySelector(
      ".venes-checkout-overlay"
    );


  const closeButton =
    checkout.querySelector(
      ".checkout-close"
    );


  closeButton.addEventListener(
    "click",
    function () {

      checkout.remove();

    }
  );


  checkout.addEventListener(
    "click",
    function (event) {

      if (
        event.target === checkout
      ) {

        checkout.remove();

      }

    }
  );


  /* =====================================================
  PLACE ORDER
  ===================================================== */

  const placeOrderButton =
    checkout.querySelector(
      ".place-order-button"
    );


  placeOrderButton.addEventListener(
    "click",
    function () {

      const name =
        checkout
          .querySelector("#checkout-name")
          .value
          .trim();


      const phone =
        checkout
          .querySelector("#checkout-phone")
          .value
          .trim();


      const location =
        checkout
          .querySelector("#checkout-location")
          .value
          .trim();


      const notes =
        checkout
          .querySelector("#checkout-notes")
          .value
          .trim();


      if (!name) {

        alert(
          "Please enter your full name."
        );

        return;

      }


      if (!phone) {

        alert(
          "Please enter your phone number."
        );

        return;

      }


      if (!location) {

        alert(
          "Please enter your delivery location."
        );

        return;

      }


      let message =
        "VENES COLLECTION ORDER\n\n";


      message +=
        "CUSTOMER DETAILS\n";

      message +=
        "Name: " +
        name +
        "\n";

      message +=
        "Phone: " +
        phone +
        "\n";

      message +=
        "Delivery Location: " +
        location +
        "\n";


      if (notes) {

        message +=
          "Delivery Notes: " +
          notes +
          "\n";

      }


      message +=
        "\nORDER DETAILS\n";


      cart.forEach(function (item) {

        message +=
          item.name +
          "\n";

        if (item.size) {

          message +=
            "Size: " +
            item.size +
            "\n";

        }

        message +=
          "Quantity: " +
          item.quantity +
          "\n";

        message +=
          "Price: GH₵ " +
          (item.price * item.quantity) +
          "\n\n";

      });


      message +=
        "TOTAL: GH₵ " +
        total +
        "\n\n";


      message +=
        "PAYMENT METHOD: MOBILE MONEY — MTN\n";

      message +=
        "MTN PAYMENT NUMBER: 0559584979\n\n";

     
