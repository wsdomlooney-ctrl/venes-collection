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


  navigation.querySelectorAll("a").forEach(function (link) {

    link.addEventListener("click", function () {

      navigation.classList.remove("mobile-open");

    });

  });

}


/* =========================================================
SHOP CATEGORY FILTER
========================================================= */

const categoryButtons =
  document.querySelectorAll(".category");

const productCards =
  document.querySelectorAll(".product-card");


categoryButtons.forEach(function (button) {

  button.addEventListener("click", function (event) {

    event.preventDefault();

    const selectedCategory =
      button.getAttribute("data-category");


    categoryButtons.forEach(function (item) {

      item.classList.remove("active");

    });


    button.classList.add("active");


    productCards.forEach(function (card) {

      const productCategory =
        card.getAttribute("data-category");


      if (
        selectedCategory === "all" ||
        productCategory === selectedCategory
      ) {

        card.style.display = "";

      } else {

        card.style.display = "none";

      }

    });

  });

});


/* =========================================================
SHOPPING CART
========================================================= */

let cart = [];


/* =========================================================
GET PRODUCT
========================================================= */

function getProduct(card) {

  const nameElement =
    card.querySelector("h3");

  const priceElement =
    card.querySelector(".price");

  const imageElement =
    card.querySelector("img");


  return {

    name:
      nameElement
        ? nameElement.textContent.trim()
        : "Product",

    price:
      priceElement
        ? parseFloat(
            priceElement.textContent
              .replace(/[^\d.]/g, "")
          ) || 0
        : 0,

    image:
      imageElement
        ? imageElement.getAttribute("src")
        : ""

  };

}


/* =========================================================
CREATE CART
========================================================= */

function createCart() {

  if (document.querySelector(".cart-overlay")) {
    return;
  }


  document.body.insertAdjacentHTML(
    "beforeend",

    `

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

          <strong>GH₵ 0</strong>

        </div>


        <button class="checkout-button">
          CHECKOUT
        </button>

      </div>

    </aside>

    `
  );


  document
    .querySelector(".cart-overlay")
    .addEventListener(
      "click",
      closeCart
    );


  document
    .querySelector(".cart-close")
    .addEventListener(
      "click",
      closeCart
    );


  document
    .querySelector(".checkout-button")
    .addEventListener(
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


  document
    .querySelector(".cart-overlay")
    .classList.add("show");


  document
    .querySelector(".cart-panel")
    .classList.add("open");


  document.body.style.overflow =
    "hidden";

}


/* =========================================================
CLOSE CART
========================================================= */

function closeCart() {

  const overlay =
    document.querySelector(
      ".cart-overlay"
    );

  const panel =
    document.querySelector(
      ".cart-panel"
    );


  if (overlay) {
    overlay.classList.remove("show");
  }


  if (panel) {
    panel.classList.remove("open");
  }


  document.body.style.overflow =
    "";

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
UPDATE CART
========================================================= */

function updateCart() {

  createCart();


  const cartItems =
    document.querySelector(
      ".cart-items"
    );

  const cartTotal =
    document.querySelector(
      ".cart-total strong"
    );


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

    const item =
      document.createElement("div");


    item.className =
      "cart-item";


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
            ${product.quantity}
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
          product.price *
          product.quantity
        );

      },
      0
    );


  cartTotal.textContent =
    "GH₵ " +
    total.toLocaleString();


  document
    .querySelectorAll(".remove-item")
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          const index =
            parseInt(
              button.getAttribute(
                "data-index"
              )
            );


          cart.splice(index, 1);

          updateCart();

        }
      );

    });


  document
    .querySelectorAll(".quantity-minus")
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          const index =
            parseInt(
              button.getAttribute(
                "data-index"
              )
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


  document
    .querySelectorAll(".quantity-plus")
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          const index =
            parseInt(
              button.getAttribute(
                "data-index"
              )
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
PRODUCT CARD BAG BUTTONS
========================================================= */

document
  .querySelectorAll(".bag-button")
  .forEach(function (button) {

    button.addEventListener(
      "click",
      function (event) {

        event.stopPropagation();


        const card =
          button.closest(".product-card");


        if (!card) {
          return;
        }


        addProductToCart(
          getProduct(card)
        );

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

  document.body.insertAdjacentHTML(
    "beforeend",

    `

    <div class="product-preview-overlay">

      <div class="product-preview">

        <button
          class="product-preview-close"
          aria-label="Close"
        >
          ×
        </button>


        <img
          class="product-preview-image"
          src=""
          alt=""
        >


        <div class="product-preview-details">

          <h2
            class="product-preview-name"
          ></h2>


          <p
            class="product-preview-price"
          ></p>


          <div class="product-size-selector">

            <label for="product-size">
              SIZE
            </label>


            <select id="product-size">

              <option value="">
                SELECT SIZE
              </option>

              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>

            </select>

          </div>


          <button
            class="preview-bag-button"
          >
            ADD TO BAG
          </button>

        </div>

      </div>

    </div>

    `
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


  productImages.forEach(
    function (image) {

      image.addEventListener(
        "click",
        function () {

          const card =
            image.closest(
              ".product-card"
            );


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


          previewBagButton.dataset.productIndex =
            cards.indexOf(card);


          previewOverlay.classList.add(
            "active"
          );

        }
      );

    }
  );


  previewClose.addEventListener(
    "click",
    function () {

      previewOverlay.classList.remove(
        "active"
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

      }

    }
  );


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


      const index =
        parseInt(
          previewBagButton.dataset.productIndex
        );


      const cards =
        document.querySelectorAll(
          ".product-card"
        );


      const card =
        cards[index];


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


      closeButton.addEventListener(
        "click",
        function () {

          searchBox.remove();


          document
            .querySelectorAll(
              ".product-card"
            )
            .forEach(function (card) {

              card.style.display = "";

            });

        }
      );


      searchBox.addEventListener(
        "click",
        function (event) {

          if (
            event.target === searchBox
          ) {

            searchBox.remove();


            document
              .querySelectorAll(
                ".product-card"
              )
              .forEach(
                function (card) {

                  card.style.display =
                    "";

                }
              );

          }

        }
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

    if (event.key === "Escape") {

      closeCart();


      const preview =
        document.querySelector(
          ".product-preview-overlay"
        );


      if (preview) {

        preview.classList.remove(
          "active"
        );

      }


      const search =
        document.querySelector(
          ".venes-search-box"
        );


      if (search) {

        search.remove();


        document
          .querySelectorAll(
            ".product-card"
          )
          .forEach(
            function (card) {

              card.style.display = "";

            }
          );

      }

    }

  }
);
