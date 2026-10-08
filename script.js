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

const categoryButtons =
  document.querySelectorAll(".category");

const productCards =
  document.querySelectorAll(".product-card");


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


/* =========================================================
ADD PRODUCT TO CART
========================================================= */

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


/* =========================================================
UPDATE CART
========================================================= */

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

            <h3>
              ${item.name}
            </h3>

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

              <span>
                ${item.quantity}
              </span>

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

        <h2>
          SHOPPING BAG
        </h2>

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

          <span>
            TOTAL
          </span>

          <strong>
            GH₵ 0
          </strong>

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


  const checkoutButton =
    document.querySelector(".checkout-button");


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


createCart();


/* =========================================================
YOUR ACTUAL SHOP BUTTONS
========================================================= */

document
  .querySelectorAll(".bag-button")
  .forEach(function (button) {

    button.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        event.stopPropagation();


        const card =
          button.closest(".product-card");


        if (!card) return;


        const product =
          getProduct(card);


        addProductToCart(product);


        const panel =
          document.querySelector(".cart-panel");

        const overlay =
          document.querySelector(".cart-overlay");


        if (panel && overlay) {

          panel.classList.add("open");

          overlay.classList.add("show");

        }

      }
    );

  });


/* =========================================================
PRODUCT IMAGE PREVIEW
========================================================= */

document
  .querySelectorAll(".product-image")
  .forEach(function (imageBox) {

    imageBox.addEventListener(
      "click",
      function () {

        const card =
          imageBox.closest(".product-card");


        if (!card) return;


        const product =
          getProduct(card);


        openProductPreview(product);

      }
    );

  });


/* =========================================================
PRODUCT PREVIEW
========================================================= */

function openProductPreview(product) {

  const existing =
    document.querySelector(
      ".product-preview-overlay"
    );


  if (existing) {
    existing.remove();
  }


  document.body.insertAdjacentHTML(
    "beforeend",

    `

    <div class="product-preview-overlay active">

      <div class="product-preview">

        <button
          class="product-preview-close"
          type="button"
        >
          ×
        </button>


        <div>

          <img
            class="product-preview-image"
            src="${product.image}"
            alt="${product.name}"
          >

        </div>


        <div class="product-preview-details">

          <h2 class="product-preview-name">
            ${product.name}
          </h2>


          <p class="product-preview-price">
            GH₵ ${product.price}
          </p>


          <div class="product-size-selector">

            <label for="preview-size">
              SIZE
            </label>


            <select id="preview-size">

              <option value="">
                Select size
              </option>

              <option value="XS">
                XS
              </option>

              <option value="S">
                S
              </option>

              <option value="M">
                M
              </option>

              <option value="L">
                L
              </option>

              <option value="XL">
                XL
              </option>

              <option value="XXL">
                XXL
              </option>

            </select>

          </div>


          <button
            class="preview-bag-button"
            type="button"
          >
            ADD TO BAG
          </button>

        </div>

      </div>

    </div>

    `
  );


  const preview =
    document.querySelector(
      ".product-preview-overlay"
    );


  const close =
    preview.querySelector(
      ".product-preview-close"
    );


  const addButton =
    preview.querySelector(
      ".preview-bag-button"
    );


  const sizeSelect =
    preview.querySelector(
      "#preview-size"
    );


  close.addEventListener(
    "click",
    function () {

      preview.remove();

    }
  );


  preview.addEventListener(
    "click",
    function (event) {

      if (event.target === preview) {

        preview.remove();

      }

    }
  );


  addButton.addEventListener(
    "click",
    function () {

      const selectedSize =
        sizeSelect.value;


      addProductToCart(
        product,
        selectedSize
      );


      preview.remove();


      const panel =
        document.querySelector(".cart-panel");

      const overlay =
        document.querySelector(".cart-overlay");


      if (panel && overlay) {

        panel.classList.add("open");

        overlay.classList.add("show");

      }

    }
  );

}


/* =========================================================
HEADER SHOPPING BAG
========================================================= */

const bagButton =
  document.querySelector(
    '.header-icons button[aria-label="Shopping Bag"]'
  );


if (bagButton) {

  bagButton.addEventListener(
    "click",
    function () {

      const panel =
        document.querySelector(".cart-panel");

      const overlay =
        document.querySelector(".cart-overlay");


      if (panel && overlay) {

        panel.classList.add("open");

        overlay.classList.add("show");

      }

    }
  );

}


/* =========================================================
SEARCH
========================================================= */

const searchButton =
  document.querySelector(
    '.header-icons button[aria-label="Search"]'
  );


if (searchButton) {

  searchButton.addEventListener(
    "click",
    function () {

      const existing =
        document.querySelector(
          ".venes-search-box"
        );


      if (existing) return;


      document.body.insertAdjacentHTML(
        "beforeend",

        `

        <div class="venes-search-box">

          <div class="search-inner">

            <input
              id="venes-search-input"
              type="text"
              placeholder="Search products..."
            >


            <button
              id="venes-search-close"
              type="button"
            >
              ×
            </button>

          </div>

        </div>

        `
      );


      const searchBox =
        document.querySelector(
          ".venes-search-box"
        );


      const input =
        document.querySelector(
          "#venes-search-input"
        );


      const close =
        document.querySelector(
          "#venes-search-close"
        );


      input.focus();


      input.addEventListener(
        "input",
        function () {

          const searchTerm =
            input.value
              .toLowerCase()
              .trim();


          document
            .querySelectorAll(".product-card")
            .forEach(function (card) {

              const productName =
                card
                  .querySelector("h3")
                  ?.textContent
                  .toLowerCase() || "";


              if (
                !searchTerm ||
                productName.includes(searchTerm)
              ) {

                card.style.display = "";

              } else {

                card.style.display = "none";

              }

            });

        }
      );


      close.addEventListener(
        "click",
        function () {

          searchBox.remove();

        }
      );


      searchBox.addEventListener(
        "click",
        function (event) {

          if (event.target === searchBox) {

            searchBox.remove();

          }

        }
      );

    }
  );

}


/* =========================================================
ACCOUNT
========================================================= */

const accountButton =
  document.querySelector(
    '.header-icons button[aria-label="Account"]'
  );


if (accountButton) {

  accountButton.addEventListener(
    "click",
    function () {

      const existing =
        document.querySelector(
          ".venes-account-panel"
        );


      if (existing) {

        existing.remove();

        return;

      }


      document.body.insertAdjacentHTML(
        "beforeend",

        `

        <div class="venes-account-panel active">

          <div class="account-box">

            <button
              class="account-close"
              type="button"
            >
              ×
            </button>


            <h2>
              MY ACCOUNT
            </h2>


            <p>
              Manage your Venes Collection orders.
            </p>


            <button
              class="account-option"
              type="button"
              id="view-orders-button"
            >
              MY ORDERS
            </button>


            <button
              class="account-option"
              type="button"
              id="account-shop-button"
            >
              CONTINUE SHOPPING
            </button>

          </div>

        </div>

        `
      );


      const panel =
        document.querySelector(
          ".venes-account-panel"
        );


      panel
        .querySelector(".account-close")
        .addEventListener(
          "click",
          function () {

            panel.remove();

          }
        );


      panel.addEventListener(
        "click",
        function (event) {

          if (event.target === panel) {

            panel.remove();

          }

        }
      );


      panel
        .querySelector("#account-shop-button")
        .addEventListener(
          "click",
          function () {

            panel.remove();

          }
        );


      panel
        .querySelector("#view-orders-button")
        .addEventListener(
          "click",
          function () {

            panel.remove();

            openOrders();

          }
        );

    }
  );

}


/* =========================================================
MY ORDERS
========================================================= */

function openOrders() {

  document.body.insertAdjacentHTML(
    "beforeend",

    `

    <div class="venes-orders-panel active">

      <div class="orders-box">

        <button
          class="orders-close"
          type="button"
        >
          ×
        </button>


        <h2>
          MY ORDERS
        </h2>


        <p class="orders-empty">
          Your recent orders will appear here.
        </p>


        <button
          class="orders-shop-button"
          type="button"
        >
          SHOP NOW
        </button>

      </div>

    </div>

    `
  );


  const panel =
    document.querySelector(
      ".venes-orders-panel"
    );


  panel
    .querySelector(".orders-close")
    .addEventListener(
      "click",
      function () {

        panel.remove();

      }
    );


  panel
    .querySelector(".orders-shop-button")
    .addEventListener(
      "click",
      function () {

        panel.remove();

      }
    );


  panel.addEventListener(
    "click",
    function (event) {

      if (event.target === panel) {

        panel.remove();

      }

    }
  );

}


/* =========================================================
CHECKOUT
========================================================= */

function openCheckout() {

  const existing =
    document.querySelector(
      ".venes-checkout-overlay"
    );


  if (existing) {
    existing.remove();
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


          <label>
            FULL NAME
          </label>

          <input
            id="checkout-name"
            type="text"
            placeholder="Enter your full name"
          >


          <label>
            PHONE NUMBER
          </label>

          <input
            id="checkout-phone"
            type="tel"
            placeholder="Enter your phone number"
          >


          <label>
            DELIVERY LOCATION
          </label>

          <input
            id="checkout-location"
            type="text"
            placeholder="Enter your delivery location"
          >


          <label>
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


  checkout
    .querySelector(".checkout-close")
    .addEventListener(
      "click",
      function () {

        checkout.remove();

      }
    );


  checkout.addEventListener(
    "click",
    function (event) {

      if (event.target === checkout) {

        checkout.remove();

      }

    }
  );


  checkout
    .querySelector(".place-order-button")
    .addEventListener(
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


        message +=
          "Please confirm payment after sending.";


        const whatsappNumber =
          "233559584979";


        const whatsappURL =
          "https://wa.me/" +
          whatsappNumber +
          "?text=" +
          encodeURIComponent(message);


        window.open(
          whatsappURL,
          "_blank"
        );


        alert(
          "Your order has been prepared. WhatsApp will open so you can send your order to Venes Collection."
        );


        checkout.remove();


        cart = [];


        updateCart();

      }
    );

}


/* =========================================================
ESC KEY
========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (event.key !== "Escape") {
      return;
    }


    const preview =
      document.querySelector(
        ".product-preview-overlay"
      );


    if (preview) {
      preview.remove();
    }


    const search =
      document.querySelector(
        ".venes-search-box"
      );


    if (search) {
      search.remove();
    }


    const checkout =
      document.querySelector(
        ".venes-checkout-overlay"
      );


    if (checkout) {
      checkout.remove();
    }


    const account =
      document.querySelector(
        ".venes-account-panel"
      );


    if (account) {
      account.remove();
    }


    const orders =
      document.querySelector(
        ".venes-orders-panel"
      );


    if (orders) {
      orders.remove();
    }

  }
);

/* =========================================================
DESKTOP PRODUCT CLICK FIX
========================================================= */

@media (min-width: 651px) {

  .product-card {
    position: relative;
  }

  .product-image {
    position: relative;
    z-index: 1;
    cursor: pointer;
  }

  .product-image img {
    position: relative;
    z-index: 2;
    pointer-events: auto;
  }

  .product-details {
    position: relative;
    z-index: 5;
  }

  .product-bottom {
    position: relative;
    z-index: 10;
  }

  .bag-button {
    position: relative;
    z-index: 20 !important;
    pointer-events: auto !important;
    cursor: pointer !important;
  }

  .product-card button {
    pointer-events: auto !important;
    cursor: pointer !important;
  }

}


