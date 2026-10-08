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

    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navigation.classList.remove("mobile-open");
      });
    });

  }


  /* =========================================================
     SHOPPING BAG
  ========================================================= */

  let cart = [];

  const bagButtons = document.querySelectorAll(".bag-button");

  const headerBag = document.querySelector(
    '.header-icons button[aria-label="Shopping Bag"]'
  );


  const cartOverlay = document.createElement("div");
  cartOverlay.className = "cart-overlay";


  const cartPanel = document.createElement("div");
  cartPanel.className = "cart-panel";

  cartPanel.innerHTML = `

    <div class="cart-header">

      <h2>Your Shopping Bag</h2>

      <button class="cart-close">×</button>

    </div>

    <div class="cart-items">

      <p class="empty-cart">
        Your bag is empty.
      </p>

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


  document.body.appendChild(cartOverlay);
  document.body.appendChild(cartPanel);


  const cartItems = cartPanel.querySelector(".cart-items");

  const cartTotal = cartPanel.querySelector(".cart-total strong");

  const cartClose = cartPanel.querySelector(".cart-close");

  const checkoutButton = cartPanel.querySelector(".checkout-button");


  function openCart() {

    cartPanel.classList.add("open");
    cartOverlay.classList.add("show");

  }


  function closeCart() {

    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("show");

  }


  cartClose.addEventListener("click", closeCart);

  cartOverlay.addEventListener("click", closeCart);


  function getProduct(card) {

    const name = card.querySelector("h3").textContent.trim();

    const priceText = card.querySelector(".price")
      .textContent
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


  function addProductToCart(product) {

    cart.push(product);

    updateCart();

    openCart();

  }


  /* =========================================================
     PRODUCT CARD — ADD TO BAG
  ========================================================= */

  bagButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      const card = button.closest(".product-card");

      if (!card) return;

      const product = getProduct(card);

      addProductToCart(product);

    });

  });


  /* =========================================================
     HEADER SHOPPING BAG
  ========================================================= */

  if (headerBag) {

    headerBag.addEventListener("click", openCart);

  }


  /* =========================================================
     UPDATE SHOPPING BAG
  ========================================================= */

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

            <img
              src="${product.image}"
              alt="${product.name}"
            >

            <div class="cart-item-info">

              <h3>${product.name}</h3>

              <p>
                GH₵ ${product.price.toLocaleString()}
              </p>

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

    }


    const total = cart.reduce(function (sum, product) {

      return sum + product.price;

    }, 0);


    cartTotal.textContent =
      `GH₵ ${total.toLocaleString()}`;


    document.querySelectorAll(".remove-item").forEach(function (button) {

      button.addEventListener("click", function () {

        const index = Number(button.dataset.index);

        cart.splice(index, 1);

        updateCart();

      });

    });

  }


  /* =========================================================
     CHECKOUT
  ========================================================= */

  checkoutButton.addEventListener("click", function () {

    if (cart.length === 0) {

      alert("Your shopping bag is empty.");

      return;

    }

    alert("Your order is ready for checkout.");

  });


  /* =========================================================
     PRODUCT PREVIEW
  ========================================================= */

  const productCards =
    document.querySelectorAll(".product-card");


  const previewOverlay =
    document.createElement("div");

  previewOverlay.className =
    "product-preview-overlay";


  previewOverlay.innerHTML = `

    <div class="product-preview">

      <button class="product-preview-close">
        ×
      </button>

      <img
        class="product-preview-image"
        src=""
        alt=""
      >

      <div class="product-preview-details">

        <h2 class="product-preview-name"></h2>

        <p class="product-preview-price"></p>

        <div class="product-size-selector">

  <label for="product-size">SIZE</label>

  <select id="product-size">

    <option value="">SELECT SIZE</option>

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


  document.body.appendChild(previewOverlay);


  const previewImage =
    previewOverlay.querySelector(".product-preview-image");

  const previewName =
    previewOverlay.querySelector(".product-preview-name");

  const previewPrice =
    previewOverlay.querySelector(".product-preview-price");

  const previewClose =
    previewOverlay.querySelector(".product-preview-close");

  const previewBagButton =
    previewOverlay.querySelector(".preview-bag-button");
  const productSize =
  previewOverlay.querySelector("#product-size");



  /* =========================================================
     OPEN PRODUCT PREVIEW
  ========================================================= */

  productCards.forEach(function (card) {

    const image =
      card.querySelector(".product-image img");

    if (!image) return;


    image.addEventListener("click", function () {

      const name =
        card.querySelector("h3").textContent.trim();

      const price =
        card.querySelector(".price").textContent.trim();


      previewImage.src = image.src;

      previewImage.alt = name;

      previewName.textContent = name;

      previewPrice.textContent = price;


      /* Save the product currently being previewed */

      previewBagButton.dataset.productIndex =
        Array.from(productCards).indexOf(card);


      previewOverlay.classList.add("active");

      document.body.classList.add("preview-open");

    });

  });


  /* =========================================================
     ADD TO BAG FROM PRODUCT PREVIEW
  ========================================================= */

  previewBagButton.addEventListener("click", function () {

  const productIndex =
    Number(previewBagButton.dataset.productIndex);
    const selectedSize = productSize.value;

if (!selectedSize) {
  alert("Please select a size.");
  return;
}


  const card =
    productCards[productIndex];

  if (!card) {
    alert("Product could not be added.");
    return;
  }

  const product = getProduct(card);

  cart.push(product);

  updateCart();

  previewOverlay.classList.remove("active");

  document.body.classList.remove("preview-open");

  openCart();

});



  /* =========================================================
     CLOSE PRODUCT PREVIEW
  ========================================================= */

  function closePreview() {

    previewOverlay.classList.remove("active");

    document.body.classList.remove("preview-open");

  }


  previewClose.addEventListener(
    "click",
    closePreview
  );


  previewOverlay.addEventListener(
    "click",
    function (event) {

      if (event.target === previewOverlay) {
        closePreview();
      }

    }
  );


  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Escape") {
        closePreview();
      }

    }
  );


});
