import { loadProducts, products } from "../data/products.js";
import { formatCurrency } from "./utils/formatCurrency.js";
import { addToCart, updateCartQuantity, cart } from "../data/cart.js";
console.log(cart);

await loadProducts("https://supersimplebackend.dev/products");

let searchParam = new URL(window.location).searchParams.get("searchQuery");

if (searchParam) {
  let newProducts = [];
  products.forEach((product) => {
    if (
      product.name.toLowerCase().includes(searchParam.toLowerCase()) ||
      product.keywords.includes(searchParam.toLowerCase())
    ) {
      newProducts.push(product);
    }
  });
  displayProducts(newProducts);
} else {
  displayProducts(products);
}

export function displayProducts(products) {
  let productsHtml = "";

  products.forEach((product) => {
    productsHtml += `
        <div class="product-container">
          <div class="product-image-container">
            <img
              class="product-image"
              src=${product.image}
            />
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img
              class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png"
            />
            <div class="product-rating-count link-primary">${
              product.rating.count
            }</div>
          </div>

          <div class="product-price">$${formatCurrency(
            product.priceCents
          )}</div>

          <div class="product-quantity-container">
            <select class='quantity-${product.id}'>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart js-add-${product.id}">
            <img src="images/icons/checkmark.png" />
            Added
          </div>

          <button data-product-id=${
            product.id
          } class="add-to-cart-button button-primary">Add to Cart</button>
        </div>
    `;
  });

  document.querySelector(".products-grid").innerHTML = productsHtml;

  document.querySelectorAll(".add-to-cart-button").forEach((link) =>
    link.addEventListener("click", () => {
      let { productId } = link.dataset;
      addToCart(productId);
      updateCartQuantity();

      document.querySelector(`.js-add-${productId}`).style.opacity = 1;

      setTimeout(() => {
        document.querySelector(`.js-add-${productId}`).style.opacity = 0;
      }, 2000);
    })
  );

  updateCartQuantity();

  document.querySelector(".search-button").addEventListener("click", () => {
    let query = document.querySelector(".search-bar").value;
    window.location = `amazon.html?searchQuery=${query}`;
  });

  document.querySelector(".search-bar").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      let query = document.querySelector(".search-bar").value;
      window.location = `amazon.html?searchQuery=${query}`;
    }
  });
}
