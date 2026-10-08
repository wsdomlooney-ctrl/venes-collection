/* =========================================================
VENES COLLECTION
MAIN JAVASCRIPT
========================================================= */


/* =========================================================
MOBILE MENU
========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

if (menuToggle && navigation) {

  menuToggle.addEventListener("click", function () {

    navigation.classList.toggle("mobile-open");

  });


  const navigationLinks = navigation.querySelectorAll("a");

  navigationLinks.forEach(function (link) {

    link.addEventListener("click", function () {

      navigation.classList.remove("mobile-open");

    });

  });

}


/* =========================================================
CART
========================================================= */

let cart = [];


/* =========================================================
GET PRODUCT INFORMATION
========================================================= */

function getProduct(card) {

  const nameElement = card.querySelector("h3");
  const priceElement = card.querySelector(".price");
  const imageElement = card.querySelector("img");

  const name =
    nameElement
      ? nameElement.textContent.trim()
      : "Product";

  const priceText =
    priceElement
      ? priceElement.textContent
      : "0";

  const price =
    parseFloat(
      priceText
        .replace(/[^\d.]/g, "")
    ) || 0;

  const image =
    imageElement
      ? imageElement.getAttribute("src")
      : "";

  return {
    name: name,
    price: price,
    image: image
  };

}


/* =========================================================
ADD PRODUCT TO CART
========================================================= */

function addProductToCart(product) {

  const existingProduct =
    cart.find(function (item) {

      return (
        item.name === product.name &&
        item.size === product.size
      );

    });


  if (existingProduct) {

    existingProduct.quantity++;

  } else {

    product.quantity = 1;

    cart.push(product);

  }


  updateCart();

  openCart();

}


/* =========================================================
CREATE CART
========================================================= */

function createCart() {

  if (document.querySelector(".cart-overlay")) {
    return;
  }


  const cartHTML = `

    <div class="cart-overlay"></div>

    <aside class="cart-panel">

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

        <div class="empty-cart">
          Your shopping bag is empty.
        </div>

      </div>


      <div class="cart-footer">

        <div class="cart-total">

          <span>TOTAL</span>

          <strong>
            GH₵ 0
          </strong>

        </div>


        <button class="checkout-button">
          CHECKOUT
        </button>

      </div>

    </aside>

  `;


  document.body.insertAdjacentHTML(
    "beforeend",
    cartHTML
  );


  const cartOverlay =
    document.querySelector(".cart-overlay");

  const cartPanel =
    document.querySelector(".cart-panel");

  const cartClose =
    document.querySelector(".cart-close");


  cartOverlay.addEventListener(
    "click",
    closeCart
  );


  cartClose.addEventListener(
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


      alert(
        "Checkout will be available soon."
      );

    }
  );

}


/* =========================================================
OPEN CART
========================================================= */

function openCart() {

  createCart();


  const cartOverlay =
    document.querySelector(".cart-overlay");

  const cartPanel =
    document.querySelector(".cart-panel");


  cartOverlay.classList.add("show");

  cartPanel.classList.add("open");

  document.body.style.overflow = "hidden";

}


/* =========================================================
CLOSE CART
========================================================= */

function closeCart() {

  const cartOverlay =
    document.querySelector(".cart-overlay");

  const cartPanel =
    document.querySelector(".cart-panel");


  if (cartOverlay) {

    cartOverlay.classList.remove("show");

  }


  if (cartPanel) {

    cartPanel.classList.remove("open");

  }


  document.body.style.overflow = "";

}


/* =========================================================
UPDATE CART
========================================================= */

function updateCart() {

  createCart();


  const cartItems =
    document.querySelector(".cart-items");

  const cartTotal =
    document.querySelector(".cart-total strong");


  if (!cartItems || !cartTotal) {
    return;
  }


  if (cart.length === 0) {

    cartItems.innerHTML = `

      <div class="empty-cart">
        Your shopping bag is empty.
      </div>

    `;

    cartTotal.textContent =
      "GH₵ 0";

    return;

  }


  cartItems.innerHTML = "";


  cart.forEach(function (product, index) {

    const item = document.createElement("div");

    item.className = "cart-item";


    item.innerHTML = `

      <img
        src="${product.image}"
        alt="${product.name}"
      >


      <div class="cart-item-info">

        <h3>
          ${product.name}
        </h3>


        ${
          product.size
            ? `<p>Size: ${product.size}</p>`
            : ""
        }


        <p>
          GH₵ ${product.price.toLocaleString()}
        </p>


        <div class="cart-quantity">

          <button
            class="quantity-minus"
            data-index="${index}"
          >
            −
          </button>


          <span>
            ${product.quantity || 1}
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

    `;


    cartItems.appendChild(item);

  });


  const total =
    cart.reduce(
      function (sum, product) {

        return (
          sum +
          (
            product.price *
            (product.quantity || 1)
          )
        );

      },
      0
    );


  cartTotal.textContent =
    "GH₵ " +
    total.toLocaleString();


  /* =====================================================
  REMOVE ITEM
  ===================================================== */

  const removeButtons =
    document.querySelectorAll(".remove-item");


  removeButtons.forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        const index =
          parseInt(
            button.dataset.index
          );


        cart.splice(index, 1);

        updateCart();

      }
    );

  });


  /* =====================================================
  DECREASE QUANTITY
  ===================================================== */

  const minusButtons =
    document.querySelectorAll(
      ".quantity-minus"
    );


  minusButtons.forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        const index =
          parseInt(
            button.dataset.index
          );


        if (
          cart[index] &&
          cart[index].quantity > 1
        ) {

          cart[index].quantity--;

        }


        updateCart();

      }
    );

  });


  /* =====================================================
  INCREASE QUANTITY
  ===================================================== */

  const plusButtons =
    document.querySelectorAll(
      ".quantity-plus"
    );


  plusButtons.forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        const index =
          parseInt(
            button.dataset.index
          );


        if (cart[index]) {

          cart[index].quantity++;

        }


        updateCart();

      }
    );

  });

}


/* =========================================================
SHOPPING BAG BUTTONS ON PRODUCT CARDS
========================================================= */

const bagButtons =
  document.querySelectorAll(".bag-button");


bagButtons.forEach(function (button) {

  button.addEventListener(
    "click",
    function (event) {

      event.stopPropagation();


      const card =
        button.closest(".product-card");


      if (!card) {
        return;
      }


      const product =
        getProduct(card);


      addProductToCart(product);

    }
  );

});


/* =========================================================
PRODUCT PREVIEW
========================================================= */

const productImages =
  document.querySelectorAll(
    ".product-image img"
  );


if (productImages.length > 0) {

  const previewHTML = `

    <div class="product-preview-overlay">

      <div class="product-preview">

        <button
          class="product-preview-close"
          aria-label="Close product preview"
        >
          ×
        </button>


        <div class="product-preview-image-container">

          <img
            class="product-preview-image"
            src=""
            alt=""
          >

        </div>


        <div class="product-preview-details">

          <h2 class="product-preview-name"></h2>

          <p class="product-preview-price"></p>


          <div class="product-size-selector">

            <label for="product-size">
              SIZE
            </label>


            <select id="product-size">

              <option value="">
                SELECT SIZE
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


          <button class="preview-bag-button">
            ADD TO BAG
          </button>

        </div>

      </div>

    </div>

  `;


  document.body.insertAdjacentHTML(
    "beforeend",
    previewHTML
  );


  const previewOverlay =
    document.querySelector(
      ".product-preview-overlay"
    );


  const previewImage =
    document.querySelector(
      ".product-preview-image"
    );


  const previewName =
    document.querySelector(
      ".product-preview-name"
    );


  const previewPrice =
    document.querySelector(
      ".product-preview-price"
    );


  const previewClose =
    document.querySelector(
      ".product-preview-close"
    );


  const previewBagButton =
    document.querySelector(
      ".preview-bag-button"
    );


  const productSize =
    document.querySelector(
      "#product-size"
    );


  /* =====================================================
  OPEN PRODUCT PREVIEW
  ===================================================== */

  productImages.forEach(function (image) {

    image.addEventListener(
      "click",
      function () {

        const card =
          image.closest(".product-card");


        if (!card) {
          return;
        }


        const product =
          getProduct(card);


        previewImage.src =
          product.image;


        previewImage.alt =
          product.name;


        previewName.textContent =
          product.name;


        previewPrice.textContent =
          "GH₵ " +
          product.price.toLocaleString();


        productSize.value = "";


        const cards =
          Array.from(
            document.querySelectorAll(
              ".product-card"
            )
          );


        const productIndex =
          cards.indexOf(card);


        previewBagButton.dataset.productIndex =
          productIndex;


        previewOverlay.classList.add(
          "active"
        );


        document.body.classList.add(
          "preview-open"
        );

      }
    );

  });


  /* =====================================================
  CLOSE PRODUCT PREVIEW
  ===================================================== */

  previewClose.addEventListener(
    "click",
    function () {

      previewOverlay.classList.remove(
        "active"
      );


      document.body.classList.remove(
        "preview-open"
      );

    }
  );


  previewOverlay.addEventListener(
    "click",
    function (event) {

      if (
        event.target ===
        previewOverlay
      ) {

        previewOverlay.classList.remove(
          "active"
        );


        document.body.classList.remove(
          "preview-open"
        );

      }

    }
  );


  /* =====================================================
  ADD TO BAG FROM PRODUCT PREVIEW
  ===================================================== */

  previewBagButton.addEventListener(
    "click",
    function () {

      const selectedSize =
        productSize.value;


      if (!selectedSize) {

        alert(
          "Please select a size."
        );

        return;

      }


      const productIndex =
        parseInt(
          previewBagButton.dataset.productIndex
        );


      const cards =
        document.querySelectorAll(
          ".product-card"
        );


      const card =
        cards[productIndex];


      if (!card) {
        return;
      }


      const product =
        getProduct(card);


      product.size =
        selectedSize;


      addProductToCart(product);


      previewOverlay.classList.remove(
        "active"
      );


      document.body.classList.remove(
        "preview-open"
      );

    }
  );

}


/* =========================================================
HEADER SHOPPING BAG
========================================================= */

const headerBagButton =
  document.querySelector(
    '.header-icons button[aria-label="Shopping Bag"]'
  );


if (headerBagButton) {

  headerBagButton.addEventListener(
    "click",
    function () {

      openCart();

    }
  );

}


/* =========================================================
SHOP CATEGORY FILTER
========================================================= */

const categoryButtons =
  document.querySelectorAll(
    ".category"
  );


const productCards =
  document.querySelectorAll(
    ".product-card"
  );


if (
  categoryButtons.length > 0 &&
  productCards.length > 0
) {

  categoryButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const selectedCategory =
            button.dataset.category;


          /* Remove active from all */

          categoryButtons.forEach(
            function (btn) {

              btn.classList.remove(
                "active"
              );

            }
          );


          /* Add active to clicked button */

          button.classList.add(
            "active"
          );


          /* Filter products */

          productCards.forEach(
            function (card) {

              const productCategory =
                card.dataset.category;


              if (
                selectedCategory === "all" ||
                productCategory ===
                  selectedCategory
              ) {

                card.style.display =
                  "";

              } else {

                card.style.display =
                  "none";

              }

            }
          );

        }
      );

    }
  );

}


/* =========================================================
ESC KEY
CLOSE CART / PREVIEW
========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Escape") {

      closeCart();


      const previewOverlay =
        document.querySelector(
          ".product-preview-overlay"
        );


      if (previewOverlay) {

        previewOverlay.classList.remove(
          "active"
        );

      }


      document.body.classList.remove(
        "preview-open"
      );

    }

  }
);
