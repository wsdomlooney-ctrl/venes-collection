document.addEventListener("DOMContentLoaded", function () {

  /* =========================================================
     VENES COLLECTION — MAIN SCRIPT
  ========================================================= */

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      navigation.classList.toggle("mobile-open");
    });

    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navigation.classList.remove("mobile-open");
      });
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

    const image =
      card.querySelector(".product-image img");

    const name =
      card.querySelector("h3");

    const price =
      card.querySelector(".price");

    return {
      name: name ? name.textContent.trim() : "Venes Collection Item",
      price: price ? price.textContent.trim() : "GH₵ 0",
      image: image ? image.getAttribute("src") : "",
      category: card.getAttribute("data-category") || ""
    };

  }


  /* =========================================================
     SHOPPING CART
  ========================================================= */

  let cart = [];

  function addProductToCart(product, size) {

    const existingItem = cart.find(function (item) {

      return (
        item.name === product.name &&
        item.size === (size || "")
      );

    });

    if (existingItem) {
      existingItem.quantity += 1;
    } else {

      cart.push({
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        size: size || "",
        quantity: 1
      });

    }

    updateCart();

  }


  function priceToNumber(price) {

    if (!price) return 0;

    const cleaned =
      price.replace(/[^\d.]/g, "");

    return parseFloat(cleaned) || 0;

  }


  function formatPrice(amount) {

    return (
      "GH₵ " +
      amount.toLocaleString("en-GH", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })
    );

  }


  /* =========================================================
     CREATE SHOPPING BAG
  ========================================================= */

  function createCart() {

    if (document.querySelector(".cart-panel")) {
      return;
    }

    const overlay =
      document.createElement("div");

    overlay.className = "cart-overlay";

    const panel =
      document.createElement("aside");

    panel.className = "cart-panel";

    panel.innerHTML = `
      <div class="cart-header">
        <h2>YOUR SHOPPING BAG</h2>
        <button class="cart-close" aria-label="Close shopping bag">×</button>
      </div>

      <div class="cart-items"></div>

      <div class="cart-footer">
        <div class="cart-total">
          <span>TOTAL</span>
          <strong class="cart-total-value">GH₵ 0</strong>
        </div>

        <button class="checkout-button">
          CHECKOUT
        </button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    const closeButton =
      panel.querySelector(".cart-close");

    closeButton.addEventListener("click", function () {
      closeCart();
    });

    overlay.addEventListener("click", function () {
      closeCart();
    });

    const checkoutButton =
      panel.querySelector(".checkout-button");

    checkoutButton.addEventListener("click", function () {
      openCheckout();
    });

  }


  function openCart() {

    createCart();

    const panel =
      document.querySelector(".cart-panel");

    const overlay =
      document.querySelector(".cart-overlay");

    if (panel && overlay) {

      panel.classList.add("open");
      overlay.classList.add("show");

    }

  }


  function closeCart() {

    const panel =
      document.querySelector(".cart-panel");

    const overlay =
      document.querySelector(".cart-overlay");

    if (panel) {
      panel.classList.remove("open");
    }

    if (overlay) {
      overlay.classList.remove("show");
    }

  }


  /* =========================================================
     UPDATE CART
  ========================================================= */

  function updateCart() {

    createCart();

    const itemsContainer =
      document.querySelector(".cart-items");

    const totalElement =
      document.querySelector(".cart-total-value");

    if (!itemsContainer || !totalElement) {
      return;
    }

    itemsContainer.innerHTML = "";

    if (cart.length === 0) {

      itemsContainer.innerHTML = `
        <div class="empty-cart">
          Your shopping bag is empty.
        </div>
      `;

      totalElement.textContent = "GH₵ 0";

      return;
    }

    let total = 0;

    cart.forEach(function (item, index) {

      const itemPrice =
        priceToNumber(item.price);

      const itemTotal =
        itemPrice * item.quantity;

      total += itemTotal;

      const cartItem =
        document.createElement("div");

      cartItem.className = "cart-item";

      cartItem.innerHTML = `
        <img
          src="${item.image}"
          alt="${item.name}"
        >

        <div class="cart-item-info">

          <h3>${item.name}</h3>

          <p>${item.price}</p>

          ${
            item.size
              ? `<p>Size: ${item.size}</p>`
              : ""
          }

          <div class="cart-quantity">

            <button
              class="quantity-minus"
              data-index="${index}"
            >−</button>

            <span>${item.quantity}</span>

            <button
              class="quantity-plus"
              data-index="${index}"
            >+</button>

          </div>

          <button
            class="remove-item"
            data-index="${index}"
          >
            Remove
          </button>

        </div>
      `;

      itemsContainer.appendChild(cartItem);

    });

    totalElement.textContent =
      formatPrice(total);


    /* =========================================================
       REMOVE ITEMS
    ========================================================= */

    itemsContainer
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


    /* =========================================================
       QUANTITY MINUS
    ========================================================= */

    itemsContainer
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

          }

          updateCart();

        });

      });


    /* =========================================================
       QUANTITY PLUS
    ========================================================= */

    itemsContainer
      .querySelectorAll(".quantity-plus")
      .forEach(function (button) {

        button.addEventListener("click", function () {

          const index =
            parseInt(
              button.getAttribute("data-index")
            );

          if (cart[index]) {
            cart[index].quantity += 1;
          }

          updateCart();

        });

      });

  }


  /* =========================================================
     ADD TO BAG — SHOP PAGE
  ========================================================= */

  document
    .querySelectorAll(".bag-button")
    .forEach(function (button) {

      button.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        const card =
          button.closest(".product-card");

        if (!card) {
          return;
        }

        const product =
          getProduct(card);

        addProductToCart(product);

        openCart();

      });

    });


  /* =========================================================
     PRODUCT PREVIEW
  ========================================================= */

  function createProductPreview(product) {

    const existing =
      document.querySelector(".product-preview-overlay");

    if (existing) {
      existing.remove();
    }

    const overlay =
      document.createElement("div");

    overlay.className =
      "product-preview-overlay";

    overlay.innerHTML = `
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
            ${product.price}
          </p>

          <div class="product-size-selector">

            <label for="product-size">
              SELECT SIZE
            </label>

            <select id="product-size">
              <option value="">
                Select size
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
    `;

    document.body.appendChild(overlay);

    setTimeout(function () {
      overlay.classList.add("active");
    }, 10);


    const closeButton =
      overlay.querySelector(".product-preview-close");

    closeButton.addEventListener("click", function () {
      overlay.remove();
    });


    overlay.addEventListener("click", function (event) {

      if (event.target === overlay) {
        overlay.remove();
      }

    });


    const previewButton =
      overlay.querySelector(".preview-bag-button");

    previewButton.addEventListener("click", function (event) {

      event.preventDefault();
      event.stopPropagation();

      const sizeSelect =
        overlay.querySelector("#product-size");

      const selectedSize =
        sizeSelect ? sizeSelect.value : "";

      addProductToCart(
        product,
        selectedSize
      );

      overlay.remove();

      openCart();

    });

  }


  /* =========================================================
     PRODUCT IMAGE CLICK
  ========================================================= */

  document
    .querySelectorAll(".product-image img")
    .forEach(function (image) {

      image.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        const card =
          image.closest(".product-card");

        if (!card) {
          return;
        }

        const product =
          getProduct(card);

        createProductPreview(product);

      });

    });


  /* =========================================================
     HEADER SHOPPING BAG
  ========================================================= */

  const headerIcons =
    document.querySelectorAll(".header-icons button");

  headerIcons.forEach(function (button) {

    const label =
      (
        button.getAttribute("aria-label") || ""
      ).toLowerCase();

    if (label.includes("shopping")) {

      button.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        openCart();

      });

    }

  });


  /* =========================================================
     SEARCH
  ========================================================= */

  function openSearch() {

    if (document.querySelector(".venes-search-box")) {
      return;
    }

    const searchBox =
      document.createElement("div");

    searchBox.className =
      "venes-search-box";

    searchBox.innerHTML = `
      <div class="search-inner">

        <input
          id="venes-search-input"
          type="search"
          placeholder="Search Venes Collection..."
          autocomplete="off"
        >

        <button
          id="venes-search-close"
          aria-label="Close search"
        >
          ×
        </button>

      </div>
    `;

    document.body.appendChild(searchBox);

    const input =
      searchBox.querySelector("#venes-search-input");

    const close =
      searchBox.querySelector("#venes-search-close");

    input.focus();

    close.addEventListener("click", function () {
      searchBox.remove();
    });

    searchBox.addEventListener("click", function (event) {

      if (event.target === searchBox) {
        searchBox.remove();
      }

    });

    input.addEventListener("input", function () {

      const searchTerm =
        input.value.toLowerCase().trim();

      document
        .querySelectorAll(".product-card")
        .forEach(function (card) {

          const product =
            getProduct(card);

          const searchableText =
            (
              product.name +
              " " +
              product.category
            ).toLowerCase();

          if (
            !searchTerm ||
            searchableText.includes(searchTerm)
          ) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }

        });

    });

  }


  headerIcons.forEach(function (button) {

    const label =
      (
        button.getAttribute("aria-label") || ""
      ).toLowerCase();

    if (label.includes("search")) {

      button.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        openSearch();

      });

    }

  });


  /* =========================================================
     ACCOUNT
  ========================================================= */

  function openAccount() {

    if (document.querySelector(".venes-account-panel")) {
      return;
    }

    const panel =
      document.createElement("div");

    panel.className =
      "venes-account-panel";

    panel.innerHTML = `
      <div class="account-box">

        <button
          class="account-close"
          aria-label="Close account"
        >
          ×
        </button>

        <h2>MY ACCOUNT</h2>

        <p>
          Manage your Venes Collection shopping experience.
        </p>

        <button class="account-option" id="view-orders">
          MY ORDERS
        </button>

        <button class="account-option" id="account-shop">
          CONTINUE SHOPPING
        </button>

      </div>
    `;

    document.body.appendChild(panel);

    setTimeout(function () {
      panel.classList.add("active");
    }, 10);

    panel
      .querySelector(".account-close")
      .addEventListener("click", function () {
        panel.remove();
      });

    panel
      .querySelector("#account-shop")
      .addEventListener("click", function () {
        panel.remove();

        window.location.href = "shop.html";
      });

    panel
      .querySelector("#view-orders")
      .addEventListener("click", function () {

        panel.remove();

        openOrders();

      });

  }


  headerIcons.forEach(function (button) {

    const label =
      (
        button.getAttribute("aria-label") || ""
      ).toLowerCase();

    if (label.includes("account")) {

      button.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        openAccount();

      });

    }

  });


  /* =========================================================
     MY ORDERS
  ========================================================= */

  function openOrders() {

    const panel =
      document.createElement("div");

    panel.className =
      "venes-orders-panel";

    panel.innerHTML = `
      <div class="orders-box">

        <button
          class="orders-close"
          aria-label="Close orders"
        >
          ×
        </button>

        <h2>MY ORDERS</h2>

        <p class="orders-empty">
          Your orders will appear here after checkout.
        </p>

        <button
          class="orders-shop-button"
        >
          SHOP NOW
        </button>

      </div>
    `;

    document.body.appendChild(panel);

    setTimeout(function () {
      panel.classList.add("active");
    }, 10);

    panel
      .querySelector(".orders-close")
      .addEventListener("click", function () {
        panel.remove();
      });

    panel
      .querySelector(".orders-shop-button")
      .addEventListener("click", function () {

        panel.remove();

        window.location.href =
          "shop.html";

      });

  }


  /* =========================================================
     CHECKOUT
  ========================================================= */

  function openCheckout() {

    if (cart.length === 0) {

      alert(
        "Your shopping bag is empty."
      );

      return;
    }

    let total = 0;

    let orderSummary = "";

    cart.forEach(function (item) {

      const itemPrice =
        priceToNumber(item.price);

      total +=
        itemPrice * item.quantity;

      orderSummary += `
        <div class="checkout-order-item">

          <span>
            ${item.name}
            ${
              item.size
                ? " — Size " + item.size
                : ""
            }
            × ${item.quantity}
          </span>

          <strong>
            ${formatPrice(
              itemPrice * item.quantity
            )}
          </strong>

        </div>
      `;

    });


    const checkout =
      document.createElement("div");

    checkout.className =
      "checkout-overlay";

    checkout.innerHTML = `
      <div class="checkout-box">

        <button
          class="checkout-close"
          aria-label="Close checkout"
        >
          ×
        </button>

        <h2>CHECKOUT</h2>

        <p class="checkout-subtitle">
          Complete your details to place your order.
        </p>

        <div class="checkout-order-summary">

          <h3>ORDER SUMMARY</h3>

          ${orderSummary}

          <div class="checkout-grand-total">

            <span>TOTAL</span>

            <strong>
              ${formatPrice(total)}
            </strong>

          </div>

        </div>

        <div class="checkout-form">

          <label>
            FULL NAME
          </label>

          <input
            type="text"
            id="checkout-name"
            placeholder="Your full name"
          >

          <label>
            PHONE NUMBER
          </label>

          <input
            type="tel"
            id="checkout-phone"
            placeholder="Your phone number"
          >

          <label>
            DELIVERY LOCATION
          </label>

          <input
            type="text"
            id="checkout-location"
            placeholder="Where should we deliver?"
          >

          <label>
            ADDITIONAL NOTES
          </label>

          <textarea
            id="checkout-notes"
            placeholder="Optional"
          ></textarea>

          <div class="payment-box">

            <h3>PAYMENT</h3>

            <p>
              Mobile Money — MTN
            </p>

            <strong>
              0559584979
            </strong>

            <small>
              Payment can also be sent from other networks to this MTN number.
            </small>

          </div>

          <button
            class="place-order-button"
          >
            PLACE ORDER ON WHATSAPP
          </button>

        </div>

      </div>
    `;

    document.body.appendChild(checkout);


    /* =========================================================
       CLOSE CHECKOUT
    ========================================================= */

    checkout
      .querySelector(".checkout-close")
      .addEventListener("click", function () {

        checkout.remove();

      });


    /* =========================================================
       PLACE ORDER
    ========================================================= */

    checkout
      .querySelector(".place-order-button")
      .addEventListener("click", function () {

        const name =
          document
            .querySelector("#checkout-name")
            .value.trim();

        const phone =
          document
            .querySelector("#checkout-phone")
            .value.trim();

        const location =
          document
            .querySelector("#checkout-location")
            .value.trim();

        const notes =
          document
            .querySelector("#checkout-notes")
            .value.trim();


        if (!name || !phone || !location) {

          alert(
            "Please enter your full name, phone number and delivery location."
          );

          return;

        }


        let message =
          "Hello Venes Collection!%0A%0A";

        message =
          "Hello Venes Collection!%0A%0A";

        message +=
          "I would like to place an order.%0A%0A";

        message +=
          "CUSTOMER DETAILS%0A";

        message +=
          "Name: " +
          name +
          "%0A";

        message +=
          "Phone: " +
          phone +
          "%0A";

        message +=
          "Delivery Location: " +
          location +
          "%0A";


        if (notes) {

          message +=
            "Notes: " +
            notes +
            "%0A";

        }


        message +=
          "%0AORDER%0A";


        cart.forEach(function (item) {

          message +=
            "- " +
            item.name;

          if (item.size) {

            message +=
              " (Size " +
              item.size +
              ")";

          }

          message +=
            " × " +
            item.quantity +
            " — " +
            item.price +
            "%0A";

        });


        message +=
          "%0ATOTAL: " +
          formatPrice(total) +
          "%0A";


        message +=
          "%0APayment: Mobile Money — MTN%0A";

        message +=
          "Payment Number: 0559584979%0A";

        message +=
          "Payment can also be sent from other networks to the MTN number.";


        const whatsappNumber =
          "233559584979";

        const whatsappURL =
          "https://wa.me/" +
          whatsappNumber +
          "?text=" +
          encodeURIComponent(
            decodeURIComponent(message)
          );


        window.open(
          whatsappURL,
          "_blank"
        );


        cart = [];

        updateCart();

        checkout.remove();

        closeCart();

      });

  }


  /* =========================================================
     ESC KEY
  ========================================================= */

  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Escape") {

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

        closeCart();

      }

    }
  );


  /* =========================================================
     INITIALIZE
  ========================================================= */

  createCart();
  updateCart();

});
/* =========================================================
   COLLECTION CATALOG FUNCTIONALITY
========================================================= */

const catalogFilters = document.querySelectorAll(".catalog-filter");
const catalogCards = document.querySelectorAll(".catalog-card");

/* CATALOG FILTERS */

catalogFilters.forEach(function (button) {

  button.addEventListener("click", function () {

    catalogFilters.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const selectedFilter =
      button.getAttribute("data-filter");

    catalogCards.forEach(function (card) {

      const category =
        card.getAttribute("data-category");

      if (
        selectedFilter === "all" ||
        selectedFilter === category
      ) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }

    });

  });

});


/* =========================================================
   COLLECTION PAGE - ADD TO BAG
========================================================= */

document.querySelectorAll(".catalog-bag").forEach(function (button) {

  button.addEventListener("click", function (event) {

    event.preventDefault();
    event.stopPropagation();

    const card = button.closest(".catalog-card");

    if (!card) return;

    const nameElement = card.querySelector(".catalog-info h2");
    const priceElement = card.querySelector(".catalog-price");
    const imageElement = card.querySelector(".catalog-image img");

    const productName = nameElement
      ? nameElement.textContent.trim()
      : "Venes Collection Product";

    const productPrice = priceElement
      ? parseFloat(
          priceElement.textContent.replace(/[^\d.]/g, "")
        )
      : 0;

    const productImage = imageElement
      ? imageElement.getAttribute("src")
      : "";

    if (typeof addToCart === "function") {

      addToCart({
        id: "collection-" + productName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),

        name: productName,

        price: productPrice,

        image: productImage,

        quantity: 1
      });

    }

  });

});

