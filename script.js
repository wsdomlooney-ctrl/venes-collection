
document.addEventListener("DOMContentLoaded", function () {

  /* =========================================================
     VENES COLLECTION — MAIN SCRIPT
     WHOLESALE: 10% OFF WHEN BUYING 3+ OF THE SAME PRODUCT
  ========================================================= */

  const WHOLESALE_MINIMUM = 3;
  const WHOLESALE_DISCOUNT = 0.10;

  /* =========================================================
     HELPERS
  ========================================================= */

  function priceToNumber(price) {
    if (typeof price === "number") return price;
    if (!price) return 0;

    return parseFloat(
      String(price).replace(/[^\d.]/g, "")
    ) || 0;
  }

  function formatPrice(amount) {
    return "GH₵ " + amount.toLocaleString("en-GH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function getProductKey(name) {
    return String(name || "").trim().toLowerCase();
  }

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

      const selectedCategory = button.getAttribute("data-category");

      productCards.forEach(function (card) {
        const cardCategory = card.getAttribute("data-category");

        card.style.display =
          selectedCategory === "all" ||
          selectedCategory === cardCategory
            ? ""
            : "none";
      });
    });
  });

  /* =========================================================
     PRODUCT INFORMATION
  ========================================================= */

  function getProduct(card) {
    const image = card.querySelector(".product-image img");
    const name = card.querySelector("h3");
    const price = card.querySelector(".price");

    const productName = name
      ? name.textContent.trim()
      : "Venes Collection Item";

    const rawPrice = price
      ? price.textContent.trim()
      : "GH₵ 0";

    return {
      name: productName,
      price: rawPrice,
      basePrice: priceToNumber(rawPrice),
      image: image ? image.getAttribute("src") : "",
      category: card.getAttribute("data-category") || ""
    };
  }

  /* =========================================================
     SHOPPING CART DATA
  ========================================================= */

  let cart = [];

  /*
    Products with different sizes remain separate cart lines.
    Wholesale qualification counts ALL sizes of the same product.
  */

  function getProductQuantity(productName) {
    const key = getProductKey(productName);

    return cart.reduce(function (sum, item) {
      if (getProductKey(item.name) === key) {
        return sum + item.quantity;
      }

      return sum;
    }, 0);
  }

  function qualifiesForWholesale(productName) {
    return getProductQuantity(productName) >= WHOLESALE_MINIMUM;
  }

  function getUnitPrice(item) {
    const basePrice = Number(item.basePrice) || 0;

    if (qualifiesForWholesale(item.name)) {
      return Math.round(
        basePrice * (1 - WHOLESALE_DISCOUNT) * 100
      ) / 100;
    }

    return basePrice;
  }

  function getLineTotal(item) {
    return getUnitPrice(item) * item.quantity;
  }

  function getCartTotal() {
    return cart.reduce(function (sum, item) {
      return sum + getLineTotal(item);
    }, 0);
  }

  function getRetailCartTotal() {
    return cart.reduce(function (sum, item) {
      return sum + (Number(item.basePrice) || 0) * item.quantity;
    }, 0);
  }

  function getWholesaleSavings() {
    return Math.round(
      (getRetailCartTotal() - getCartTotal()) * 100
    ) / 100;
  }

  function addProductToCart(product, size) {
    const productSize = size || "";
    const productKey = getProductKey(product.name);

    let existingItem = cart.find(function (item) {
      return (
        getProductKey(item.name) === productKey &&
        item.size === productSize
      );
    });

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: product.name,
        basePrice: Number(product.basePrice) ||
          priceToNumber(product.price),
        image: product.image || "",
        category: product.category || "",
        size: productSize,
        quantity: 1
      });
    }

    updateCart();
  }

  /* =========================================================
     CREATE SHOPPING BAG
  ========================================================= */

  function createCart() {
    if (document.querySelector(".cart-panel")) return;

    const overlay = document.createElement("div");
    overlay.className = "cart-overlay";

    const panel = document.createElement("aside");
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

        <p class="wholesale-savings" hidden></p>

        <p class="wholesale-note">
          Buy 3 or more of the same item to receive 10% off.
          Different sizes of the same item count together.
        </p>

        <button class="checkout-button">CHECKOUT</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    panel.querySelector(".cart-close").addEventListener("click", closeCart);

    overlay.addEventListener("click", closeCart);

    panel.querySelector(".checkout-button").addEventListener("click", openCheckout);
  }

  function openCart() {
    createCart();

    const panel = document.querySelector(".cart-panel");
    const overlay = document.querySelector(".cart-overlay");

    if (panel && overlay) {
      panel.classList.add("open");
      overlay.classList.add("show");
    }
  }

  function closeCart() {
    const panel = document.querySelector(".cart-panel");
    const overlay = document.querySelector(".cart-overlay");

    if (panel) panel.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
  }

  /* =========================================================
     UPDATE CART AND WHOLESALE PRICING
  ========================================================= */

  function updateCart() {
    createCart();

    const itemsContainer = document.querySelector(".cart-items");
    const totalElement = document.querySelector(".cart-total-value");
    const savingsElement = document.querySelector(".wholesale-savings");

    if (!itemsContainer || !totalElement) return;

    itemsContainer.innerHTML = "";

    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="empty-cart">Your shopping bag is empty.</div>
      `;

      totalElement.textContent = formatPrice(0);

      if (savingsElement) {
        savingsElement.hidden = true;
        savingsElement.textContent = "";
      }

      return;
    }

    /*
      Recalculate the quantity of every product before rendering.
      This ensures the discount applies to all sizes once the
      combined quantity of the product reaches three.
    */

    cart.forEach(function (item, index) {
      const basePrice = Number(item.basePrice) || 0;
      const unitPrice = getUnitPrice(item);
      const lineTotal = getLineTotal(item);
      const productQuantity = getProductQuantity(item.name);
      const wholesaleActive = qualifiesForWholesale(item.name);

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";

      cartItem.innerHTML = `
        <img
          src="${escapeHTML(item.image)}"
          alt="${escapeHTML(item.name)}"
        >

        <div class="cart-item-info">
          <h3>${escapeHTML(item.name)}</h3>

          ${
            wholesaleActive
              ? `
                <p class="cart-retail-price">
                  <s>${formatPrice(basePrice)}</s>
                </p>
                <p class="cart-discounted-price">
                  ${formatPrice(unitPrice)} each
                </p>
                <p class="wholesale-badge">
                  WHOLESALE: 10% OFF
                </p>
                <p class="wholesale-quantity">
                  ${productQuantity} pieces of this item
                </p>
              `
              : `
                <p>${formatPrice(basePrice)} each</p>
                ${
                  productQuantity === WHOLESALE_MINIMUM - 1
                    ? `<p class="wholesale-hint">Add 1 more of this item to unlock 10% off.</p>`
                    : ""
                }
              `
          }

          ${
            item.size
              ? `<p>Size: ${escapeHTML(item.size)}</p>`
              : ""
          }

          <p class="cart-line-total">
            Subtotal: <strong>${formatPrice(lineTotal)}</strong>
          </p>

          <div class="cart-quantity">
            <button
              class="quantity-minus"
              data-index="${index}"
              aria-label="Decrease quantity"
            >−</button>

            <span>${item.quantity}</span>

            <button
              class="quantity-plus"
              data-index="${index}"
              aria-label="Increase quantity"
            >+</button>
          </div>

          <button class="remove-item" data-index="${index}">
            Remove
          </button>
        </div>
      `;

      itemsContainer.appendChild(cartItem);
    });

    const total = getCartTotal();
    const savings = getWholesaleSavings();

    totalElement.textContent = formatPrice(total);

    if (savingsElement) {
      if (savings > 0) {
        savingsElement.hidden = false;
        savingsElement.textContent =
          "Wholesale savings: " + formatPrice(savings);
      } else {
        savingsElement.hidden = true;
        savingsElement.textContent = "";
      }
    }

    /* REMOVE ITEMS */

    itemsContainer.querySelectorAll(".remove-item").forEach(function (button) {
      button.addEventListener("click", function () {
        const index = Number(button.getAttribute("data-index"));

        if (Number.isInteger(index) && cart[index]) {
          cart.splice(index, 1);
          updateCart();
        }
      });
    });

    /* DECREASE QUANTITY */

    itemsContainer.querySelectorAll(".quantity-minus").forEach(function (button) {
      button.addEventListener("click", function () {
        const index = Number(button.getAttribute("data-index"));

        if (!Number.isInteger(index) || !cart[index]) return;

        cart[index].quantity -= 1;

        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }

        updateCart();
      });
    });

    /* INCREASE QUANTITY */

    itemsContainer.querySelectorAll(".quantity-plus").forEach(function (button) {
      button.addEventListener("click", function () {
        const index = Number(button.getAttribute("data-index"));

        if (!Number.isInteger(index) || !cart[index]) return;

        cart[index].quantity += 1;
        updateCart();
      });
    });
  }

  /* =========================================================
     ADD TO BAG — SHOP PAGE
  ========================================================= */

  document.querySelectorAll(".bag-button").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const card = button.closest(".product-card");
      if (!card) return;

      addProductToCart(getProduct(card));
      openCart();
    });
  });

  /* =========================================================
     PRODUCT PREVIEW
  ========================================================= */

  function createProductPreview(product) {
    const existing = document.querySelector(".product-preview-overlay");

    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "product-preview-overlay";

    overlay.innerHTML = `
      <div class="product-preview">

        <button
          class="product-preview-close"
          aria-label="Close product preview"
        >×</button>

        <img
          class="product-preview-image"
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
        >

        <div class="product-preview-details">
          <h2 class="product-preview-name">
            ${escapeHTML(product.name)}
          </h2>

          <p class="product-preview-price">
            ${formatPrice(product.basePrice)}
          </p>

          <p class="preview-wholesale-note">
            Buy 3 or more of this item for 10% off.
            Different sizes count together.
          </p>

          <div class="product-size-selector">
            <label for="product-size">SELECT SIZE</label>

            <select id="product-size">
              <option value="">Select size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          <button class="preview-bag-button">ADD TO BAG</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(function () {
      overlay.classList.add("active");
    });

    overlay.querySelector(".product-preview-close").addEventListener("click", function () {
      overlay.remove();
    });

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) overlay.remove();
    });

    overlay.querySelector(".preview-bag-button").addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const sizeSelect = overlay.querySelector("#product-size");
      const selectedSize = sizeSelect ? sizeSelect.value : "";

      addProductToCart(product, selectedSize);

      overlay.remove();
      openCart();
    });
  }

  /* =========================================================
     PRODUCT IMAGE CLICK
  ========================================================= */

  document.querySelectorAll(".product-image img").forEach(function (image) {
    image.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const card = image.closest(".product-card");
      if (!card) return;

      createProductPreview(getProduct(card));
    });
  });

  /* =========================================================
     HEADER ICONS
  ========================================================= */

  const headerIcons = document.querySelectorAll(".header-icons button");

  headerIcons.forEach(function (button) {
    const label = (button.getAttribute("aria-label") || "").toLowerCase();

    if (label.includes("shopping")) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        openCart();
      });
    }

    if (label.includes("search")) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        openSearch();
      });
    }

    if (label.includes("account")) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        openAccount();
      });
    }
  });

  /* =========================================================
     SEARCH
  ========================================================= */

  function openSearch() {
    if (document.querySelector(".venes-search-box")) return;

    const searchBox = document.createElement("div");
    searchBox.className = "venes-search-box";

    searchBox.innerHTML = `
      <div class="search-inner">
        <input
          id="venes-search-input"
          type="search"
          placeholder="Search Venes Collection..."
          autocomplete="off"
        >

        <button id="venes-search-close" aria-label="Close search">×</button>
      </div>
    `;

    document.body.appendChild(searchBox);

    const input = searchBox.querySelector("#venes-search-input");
    input.focus();

    searchBox.querySelector("#venes-search-close").addEventListener("click", function () {
      searchBox.remove();
    });

    searchBox.addEventListener("click", function (event) {
      if (event.target === searchBox) searchBox.remove();
    });

    input.addEventListener("input", function () {
      const searchTerm = input.value.toLowerCase().trim();

      document.querySelectorAll(".product-card").forEach(function (card) {
        const product = getProduct(card);

        const searchableText =
          (product.name + " " + product.category).toLowerCase();

        card.style.display =
          !searchTerm || searchableText.includes(searchTerm)
            ? ""
            : "none";
      });
    });
  }

  /* =========================================================
     ACCOUNT
  ========================================================= */

  function openAccount() {
    if (document.querySelector(".venes-account-panel")) return;

    const panel = document.createElement("div");
    panel.className = "venes-account-panel";

    panel.innerHTML = `
      <div class="account-box">
        <button class="account-close" aria-label="Close account">×</button>

        <h2>MY ACCOUNT</h2>

        <p>Manage your Venes Collection shopping experience.</p>

        <button class="account-option" id="view-orders">MY ORDERS</button>
        <button class="account-option" id="account-shop">CONTINUE SHOPPING</button>
      </div>
    `;

    document.body.appendChild(panel);

    requestAnimationFrame(function () {
      panel.classList.add("active");
    });

    panel.querySelector(".account-close").addEventListener("click", function () {
      panel.remove();
    });

    panel.querySelector("#account-shop").addEventListener("click", function () {
      panel.remove();
      window.location.href = "shop.html";
    });

    panel.querySelector("#view-orders").addEventListener("click", function () {
      panel.remove();
      openOrders();
    });
  }

  /* =========================================================
     MY ORDERS
  ========================================================= */

  function openOrders() {
    const panel = document.createElement("div");
    panel.className = "venes-orders-panel";

    panel.innerHTML = `
      <div class="orders-box">
        <button class="orders-close" aria-label="Close orders">×</button>

        <h2>MY ORDERS</h2>

        <p class="orders-empty">
          Your orders will appear here after checkout.
        </p>

        <button class="orders-shop-button">SHOP NOW</button>
      </div>
    `;

    document.body.appendChild(panel);

    requestAnimationFrame(function () {
      panel.classList.add("active");
    });

    panel.querySelector(".orders-close").addEventListener("click", function () {
      panel.remove();
    });

    panel.querySelector(".orders-shop-button").addEventListener("click", function () {
      panel.remove();
      window.location.href = "shop.html";
    });
  }

  /* =========================================================
     CHECKOUT — WHOLESALE-AWARE TOTALS
  ========================================================= */

  function openCheckout() {
    if (cart.length === 0) {
      alert("Your shopping bag is empty.");
      return;
    }

    const total = getCartTotal();
    const savings = getWholesaleSavings();

    let orderSummary = "";

    cart.forEach(function (item) {
      const unitPrice = getUnitPrice(item);
      const lineTotal = getLineTotal(item);
      const wholesaleActive = qualifiesForWholesale(item.name);

      orderSummary += `
        <div class="checkout-order-item">
          <span>
            ${escapeHTML(item.name)}
            ${item.size ? " — Size " + escapeHTML(item.size) : ""}
            × ${item.quantity}

            ${wholesaleActive ? "<br>Wholesale price (10% off)" : ""}
          </span>

          <strong>${formatPrice(lineTotal)}</strong>
        </div>
      `;
    });

    const checkout = document.createElement("div");
    checkout.className = "checkout-overlay";

    checkout.innerHTML = `
      <div class="checkout-box">

        <button class="checkout-close" aria-label="Close checkout">×</button>

        <h2>CHECKOUT</h2>

        <p class="checkout-subtitle">
          Complete your details to place your order.
        </p>

        <div class="checkout-order-summary">
          <h3>ORDER SUMMARY</h3>

          ${orderSummary}

          ${
            savings > 0
              ? `
                <div class="checkout-wholesale-savings">
                  Wholesale savings: <strong>${formatPrice(savings)}</strong>
                </div>
              `
              : ""
          }

          <div class="checkout-grand-total">
            <span>TOTAL</span>
            <strong>${formatPrice(total)}</strong>
          </div>
        </div>

        <div class="checkout-form">
          <label for="checkout-name">FULL NAME</label>
          <input type="text" id="checkout-name" placeholder="Your full name">

          <label for="checkout-phone">PHONE NUMBER</label>
          <input type="tel" id="checkout-phone" placeholder="Your phone number">

          <label for="checkout-location">DELIVERY LOCATION</label>
          <input type="text" id="checkout-location" placeholder="Where should we deliver?">

          <label for="checkout-notes">ADDITIONAL NOTES</label>
          <textarea id="checkout-notes" placeholder="Optional"></textarea>

          <div class="payment-box">
            <h3>PAYMENT</h3>
            <p>Mobile Money — MTN</p>
            <strong>0559584979</strong>
            <small>
              Payment can also be sent from other networks to this MTN number.
            </small>
          </div>

          <button class="place-order-button">PLACE ORDER ON WHATSAPP</button>
        </div>
      </div>
    `;

    document.body.appendChild(checkout);

    checkout.querySelector(".checkout-close").addEventListener("click", function () {
      checkout.remove();
    });

    checkout.querySelector(".place-order-button").addEventListener("click", function () {
      const name = checkout.querySelector("#checkout-name").value.trim();
      const phone = checkout.querySelector("#checkout-phone").value.trim();
      const location = checkout.querySelector("#checkout-location").value.trim();
      const notes = checkout.querySelector("#checkout-notes").value.trim();

      if (!name || !phone || !location) {
        alert("Please enter your full name, phone number and delivery location.");
        return;
      }

      const orderTotal = getCartTotal();
      const orderSavings = getWholesaleSavings();

      let message = "Hello Venes Collection!\n\n";
      message += "I would like to place an order.\n\n";

      message += "CUSTOMER DETAILS\n";
      message += "Name: " + name + "\n";
      message += "Phone: " + phone + "\n";
      message += "Delivery Location: " + location + "\n";

      if (notes) {
        message += "Notes: " + notes + "\n";
      }

      message += "\nORDER DETAILS\n";

      cart.forEach(function (item) {
        const unitPrice = getUnitPrice(item);
        const lineTotal = getLineTotal(item);
        const wholesaleActive = qualifiesForWholesale(item.name);

        message += "- " + item.name;

        if (item.size) {
          message += " (Size " + item.size + ")";
        }

        message += "\n";
        message += "  Quantity: " + item.quantity + "\n";
        message += "  Unit price: " + formatPrice(unitPrice) + "\n";

        if (wholesaleActive) {
          message += "  Wholesale discount: 10%\n";
        }

        message += "  Subtotal: " + formatPrice(lineTotal) + "\n\n";
      });

      if (orderSavings > 0) {
        message += "Wholesale savings: " + formatPrice(orderSavings) + "\n";
      }

      message += "TOTAL: " + formatPrice(orderTotal) + "\n\n";
      message += "Payment: Mobile Money — MTN\n";
      message += "Payment Number: 0559584979\n";
      message += "Payment can also be sent from other networks to the MTN number.";

      const whatsappURL =
        "https://wa.me/233559584979?text=" +
        encodeURIComponent(message);

      window.open(whatsappURL, "_blank");

      cart = [];
      updateCart();
      checkout.remove();
      closeCart();
    });
  }

  /* =========================================================
     ESC KEY
  ========================================================= */

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;

    [
      ".product-preview-overlay",
      ".venes-search-box",
      ".venes-account-panel",
      ".venes-orders-panel",
      ".checkout-overlay"
    ].forEach(function (selector) {
      const element = document.querySelector(selector);
      if (element) element.remove();
    });

    closeCart();
  });

  /* =========================================================
     INITIALIZE
  ========================================================= */

  createCart();
  updateCart();

});

