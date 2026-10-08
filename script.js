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
SHOPPING BAG
========================================================= */

let cart = [];


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
      `<p class="empty-cart">Your shopping bag is empty.</p>`;

    if (cartTotal) {
      cartTotal.textContent = "GH₵ 0";
    }

    return;

  }


  let total = 0;


  cartItems.innerHTML =
    cart.map(function (item, index) {

      total +=
        item.price * item.quantity;


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
              >
                −
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                class="quantity-plus"
                data-index="${index}"
              >
                +
              </button>

            </div>

            <button
              class="remove-item"
              data-index="${index}"
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

        if (cart[index]) {

          cart[index].quantity -= 1;

          if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
          }

          updateCart();

        }

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

        if (cart[index]) {

          cart[index].quantity += 1;

          updateCart();

        }

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


        <button class="checkout-button">
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
  CHECKOUT
  ===================================================== */

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
CHECKOUT FUNCTION
========================================================= */

function openCheckout() {

  const existingCheckout =
    document.querySelector(".venes-checkout-overlay");

  if (existingCheckout) {
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


          <label>
            FULL NAME
          </label>

          <input
            type="text"
            id="checkout-name"
            placeholder="Enter your full name"
          >


          <label>
            PHONE NUMBER
          </label>

          <input
            type="tel"
            id="checkout-phone"
            placeholder="Enter your phone number"
          >


          <label>
            DELIVERY LOCATION
          </label>

          <input
            type="text"
            id="checkout-location"
            placeholder="Where should we deliver your order?"
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
        "VENES COLLECTION ORDER%0A%0A";


      message +=
        "CUSTOMER DETAILS%0A";

      message +=
        "Name: " +
        encodeURIComponent(name) +
        "%0A";

      message +=
        "Phone: " +
        encodeURIComponent(phone) +
        "%0A";

      message +=
        "Delivery Location: " +
        encodeURIComponent(location) +
        "%0A";


      if (notes) {

        message +=
          "Delivery Notes: " +
          encodeURIComponent(notes) +
          "%0A";

      }


      message +=
        "%0AORDER DETAILS%0A";


      cart.forEach(function (item) {

        message +=
          encodeURIComponent(
            item.name
          ) +
          "%0A";

        if (item.size) {

          message +=
            "Size: " +
            encodeURIComponent(
              item.size
            ) +
            "%0A";

        }

        message +=
          "Quantity: " +
          item.quantity +
          "%0A";

        message +=
          "Price: GH₵ " +
          item.price *
          item.quantity +
          "%0A%0A";

      });


      message +=
        "TOTAL: GH₵ " +
        total +
        "%0A%0A";


      message +=
        "PAYMENT METHOD: MOBILE MONEY — MTN%0A";

      message +=
        "MTN PAYMENT NUMBER: 0559584979%0A%0A";

      message +=
        "Customer can send payment from any mobile money network.";


      window.location.href =
        "https://wa.me/233559584979?text=" +
        message;

    }
  );

}


/* =========================================================
PRODUCT CARD ADD TO BAG
========================================================= */

document
  .querySelectorAll(".bag-button")
  .forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

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
PRODUCT PREVIEW
========================================================= */

document
  .querySelectorAll(".product-image img")
  .forEach(function (image) {

    image.addEventListener(
      "click",
      function () {

        const card =
          image.closest(".product-card");

        if (!card) return;

        const product =
          getProduct(card);


        document.body.insertAdjacentHTML(
          "beforeend",

          `

          <div class="product-preview-overlay">

            <div class="product-preview">

              <button
                class="product-preview-close"
                aria-label="Close product preview"
              >
                ×
              </button>


              <img
                class="product-preview-image"
                src="${product.image}"
                alt="${product.name}"
              >


              <div class="product-preview-details">

                <h2 class="product-preview-name">
                  ${product.name}
                </h2>


                <p class="product-preview-price">
                  GH₵ ${product.price}
                </p>


                <div class="product-size-selector">

                  <label for="product-size">
                    SELECT SIZE
                  </label>

                  <select id="product-size">

                    <option value="">
                      Choose a size
                    </option>

                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>

                  </select>

                </div>


                <button class="preview-bag-button">
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


        const closeButton =
          preview.querySelector(
            ".product-preview-close"
          );


        const addButton =
          preview.querySelector(
            ".preview-bag-button"
          );


        const sizeSelect =
          preview.querySelector(
            "#product-size"
          );


        closeButton.addEventListener(
          "click",
          function () {

            preview.remove();

          }
        );


        preview.addEventListener(
          "click",
          function (event) {

            if (
              event.target === preview
            ) {

              preview.remove();

            }

          }
        );


        addButton.addEventListener(
          "click",
          function () {

            const size =
              sizeSelect.value;


            if (!size) {

              alert(
                "Please select a size."
              );

              return;

            }


            addProductToCart(
              product,
              size
            );


            preview.remove();


            const panel =
              document.querySelector(
                ".cart-panel"
              );


            const overlay =
              document.querySelector(
                ".cart-overlay"
              );


            if (panel && overlay) {

              panel.classList.add("open");
              overlay.classList.add("show");

            }

          }
        );

      }

    );

  });


/* =========================================================
HEADER SHOPPING BAG
========================================================= */

const cartButton =
  document.querySelector(
    '.header-icons button[aria-label="Shopping Bag"]'
  );


if (cartButton) {

  cartButton.addEventListener(
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

      let searchBox =
        document.querySelector(
          ".venes-search-box"
        );


      if (searchBox) {

        const input =
          document.querySelector(
            "#venes-search-input"
          );

        if (input) {
          input.focus();
        }

        return;

      }


      document.body.insertAdjacentHTML(
        "beforeend",

        `

        <div class="venes-search-box">

          <div class="search-inner">

            <input
              type="text"
              id="venes-search-input"
              placeholder="Search products..."
              autocomplete="off"
            >

            <button
              id="venes-search-close"
              aria-label="Close search"
            >
              ×
            </button>

          </div>

        </div>

        `
      );


      searchBox =
        document.querySelector(
          ".venes-search-box"
        );


      const input =
        document.querySelector(
          "#venes-search-input"
        );


      const closeButton =
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
            .querySelectorAll(
              ".product-card"
            )
            .forEach(function (card) {

              const name =
                card.querySelector("h3")
                  ?.textContent
                  .toLowerCase() || "";


              card.style.display =
                (
                  searchTerm === "" ||
                  name.includes(searchTerm)
                )
                  ? ""
                  : "none";

            });

        }
      );


      function closeSearch() {

        searchBox.remove();

        document
          .querySelectorAll(
            ".product-card"
          )
          .forEach(function (card) {

            card.style.display = "";

          });

      }


      closeButton.addEventListener(
        "click",
        closeSearch
      );


      searchBox.addEventListener(
        "click",
        function (event) {

          if (
            event.target === searchBox
          ) {

            closeSearch();

          }

        }
      );

    }
  );

}


/* =========================================================
ACCOUNT PANEL
========================================================= */

const accountButton =
  document.querySelector(
    '.header-icons button[aria-label="Account"]'
  );


if (accountButton) {

  accountButton.addEventListener(
    "click",
    function () {

      let accountPanel =
        document.querySelector(
          ".venes-account-panel"
        );


      if (!accountPanel) {

        accountPanel =
          document.createElement("div");

        accountPanel.className =
          "venes-account-panel";


        accountPanel.innerHTML = `

          <div class="account-box">

            <button
              class="account-close"
              aria-label="Close account"
            >
              ×
            </button>


            <h2>MY ACCOUNT</h2>


            <p>
              Welcome to Venes Collection.
            </p>


            <button
              class="account-option"
              type="button"
              data-account-action="orders"
            >
              MY ORDERS
            </button>


            <button
              class="account-option"
              type="button"
              data-account-action="bag"
            >
              SHOPPING BAG
            </button>


            <button
              class="account-option"
              type="button"
              data-account-action="whatsapp"
            >
              WHATSAPP
            </button>


            <button
              class="account-option"
              type="button"
              data-account-action="tiktok"
            >
              TIKTOK
            </button>


            <button
              class="account-option"
              type="button"
              data-account-action="support"
            >
              CONTACT SUPPORT
            </button>

          </div>

        `;


        document.body.appendChild(
          accountPanel
        );


        const closeButton =
          accountPanel.querySelector(
            ".account-close"
          );


        closeButton.addEventListener(
          "click",
          function () {

            accountPanel.classList.remove(
              "active"
            );

          }
        );


        accountPanel.addEventListener(
          "click",
          function (event) {

            if (
              event.target === accountPanel
            ) {

              accountPanel.classList.remove(
                "active"
              );

            }

          }
        );


        const accountOptions =
          accountPanel.querySelectorAll(
            ".account-option"
          );


        accountOptions.forEach(
          function (option) {

            option.addEventListener(
              "click",
              function () {

                const action =
                  option.getAttribute(
                    "data-account-action"
                  );


                /* MY ORDERS */

                if (
                  action === "orders"
                ) {

                  accountPanel.classList.remove(
                    "active"
                  );


                  let ordersPanel =
                    document.querySelector(
                      ".venes-orders-panel"
                    );


                  if (!ordersPanel) {

                    ordersPanel =
                      document.createElement(
                        "div"
                      );


                    ordersPanel.className =
                      "venes-orders-panel";


                    ordersPanel.innerHTML = `

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
                          You don't have any orders yet.
                        </p>


                        <button
                          class="orders-shop-button"
                          type="button"
                        >
                          START SHOPPING
                        </button>

                      </div>

                    `;


                    document.body.appendChild(
                      ordersPanel
                    );


                    const ordersClose =
                      ordersPanel.querySelector(
                        ".orders-close"
                      );


                    ordersClose.addEventListener(
                      "click",
                      function () {

                        ordersPanel.classList.remove(
                          "active"
                        );

                      }
                    );


                    ordersPanel.addEventListener(
                      "click",
                      function (event) {

                        if (
                          event.target ===
                          ordersPanel
                        ) {

                          ordersPanel.classList.remove(
                            "active"
                          );

                        }

                      }
                    );


                    const shopButton =
                      ordersPanel.querySelector(
                        ".orders-shop-button"
                      );


                    shopButton.addEventListener(
                      "click",
                      function () {

                        window.location.href =
                          "shop.html";

                      }
                    );

                  }


                  ordersPanel.classList.add(
                    "active"
                  );

                }


                /* SHOPPING BAG */

                if (
                  action === "bag"
                ) {

                  accountPanel.classList.remove(
                    "active"
                  );


                  const panel =
                    document.querySelector(
                      ".cart-panel"
                    );


                  const overlay =
                    document.querySelector(
                      ".cart-overlay"
                    );


                  if (
                    panel &&
                    overlay
                  ) {

                    panel.classList.add(
                      "open"
                    );

                    overlay.classList.add(
                      "show"
                    );

                  }

                }


                /* WHATSAPP */

                if (
                  action === "whatsapp"
                ) {

                  window.location.href =
                    "https://wa.me/233559584979";

                }


                /* TIKTOK */

                if (
                  action === "tiktok"
                ) {

                  window.location.href =
                    "https://www.tiktok.com/@veronica.doeveve";

                }


                /* CONTACT SUPPORT */

                if (
                  action === "support"
                ) {

                  window.location.href =
                    "contact.html";

                }

              }
            );

          }
        );

      }


      accountPanel.classList.add(
        "active"
      );

    }
  );

}


/* =========================================================
ESCAPE KEY
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


    const searchBox =
      document.querySelector(
        ".venes-search-box"
      );


    if (searchBox) {

      searchBox.remove();

      document
        .querySelectorAll(
          ".product-card"
        )
        .forEach(function (card) {

          card.style.display = "";

        });

    }


    const accountPanel =
      document.querySelector(
        ".venes-account-panel"
      );


    if (accountPanel) {

      accountPanel.classList.remove(
        "active"
      );

    }


    const ordersPanel =
      document.querySelector(
        ".venes-orders-panel"
      );


    if (ordersPanel) {

      ordersPanel.classList.remove(
        "active"
      );

    }


    const checkout =
      document.querySelector(
        ".venes-checkout-overlay"
      );


    if (checkout) {
      checkout.remove();
    }


    const cartPanel =
      document.querySelector(
        ".cart-panel"
      );


    const cartOverlay =
      document.querySelector(
        ".cart-overlay"
      );


    if (
      cartPanel &&
      cartOverlay
    ) {

      cartPanel.classList.remove(
        "open"
      );

      cartOverlay.classList.remove(
        "show"
      );

    }

  }
);

});
