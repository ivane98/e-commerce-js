import { orders } from "../data/orders.js";
import dayjs from "https://unpkg.com/dayjs@1.11.13/esm/index.js";
import { formatCurrency } from "./utils/formatCurrency.js";
import { getProduct, loadProducts } from "../data/products.js";
import { addToCart, updateCartQuantity } from "../data/cart.js";

await loadProducts("https://supersimplebackend.dev/products");

console.log(orders[0]);

let orderHtml = "";

orders.forEach((order) => {
  orderHtml += `
    <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${dayjs(order.orderTime).format("MMMM D")}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
          ${displayOrderProducts(order)}
          </div>
        </div>
    `;
});

document.querySelector(".orders-grid").innerHTML = orderHtml;

document.querySelectorAll(".buy-again-button").forEach((link) => {
  link.addEventListener("click", () => {
    let { productId } = link.dataset;
    addToCart(productId);
    updateCartQuantity();
  });
});

updateCartQuantity();

function displayOrderProducts(order) {
  let productsHtml = "";
  order.products.forEach((product) => {
    let matchingProduct = getProduct(product.productId);

    productsHtml += `
        <div class="product-image-container">
                  <img src=${matchingProduct.image} />
                </div>
    
                <div class="product-details">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-delivery-date">Arriving on: ${dayjs(
                    product.estimatedDeliveryTime
                  ).format("MMMM D")}</div>
                  <div class="product-quantity">Quantity: ${
                    product.quantity
                  }</div>
                  <button data-product-id=${
                    matchingProduct.id
                  } class="buy-again-button button-primary">
                    <img class="buy-again-icon" src="images/icons/buy-again.png" />
                    <span class="buy-again-message">Buy it again</span>
                  </button>
                </div>
    
                <div class="product-actions">
                  <a href="tracking.html?orderId=${order.id}&productId=${
      product.productId
    }">
                    <button class="track-package-button button-secondary">
                      Track package
                    </button>
                  </a>
                </div>
        `;
  });

  return productsHtml;
}
