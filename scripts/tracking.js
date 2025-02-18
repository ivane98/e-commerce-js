import { getProduct, loadProducts } from "../data/products.js";
import { orders } from "../data/orders.js";
import dayjs from "https://unpkg.com/dayjs@1.11.13/esm/index.js";
import { updateCartQuantity } from "../data/cart.js";

await loadProducts("https://supersimplebackend.dev/products");

let url = new URL(window.location.href);
let searchOrderId = url.searchParams.get("orderId");
let searchProductId = url.searchParams.get("productId");

let matchingProduct = getProduct(searchProductId);
let order = orders.find((order) => order.id === searchOrderId);
let matchingOrder = orders
  .find((order) => order.id === searchOrderId)
  .products.find((product) => product.productId === searchProductId);

let today = dayjs();
let orderTime = dayjs(order.orderTime);
let deliveryTime = dayjs(matchingProduct.estimatedDeliveryTime);

let progress = today - orderTime;
let progress2 = deliveryTime - orderTime;

console.log(progress);
console.log(progress2);

let trackingHtml = "";

trackingHtml += `
    <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">Arriving on ${dayjs(
          matchingOrder.estimatedDeliveryTime
        ).format("MMMM D")}</div>

        <div class="product-info">
          ${matchingProduct.name}
        </div>

        <div class="product-info">Quantity: ${matchingOrder.quantity}</div>

        <img
          class="product-image"
          src=${matchingProduct.image}
        />

        <div class="progress-labels-container">
          <div class="progress-label">Preparing</div>
          <div class="progress-label current-status">Shipped</div>
          <div class="progress-label">Delivered</div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>
`;

document.querySelector(".order-tracking").innerHTML = trackingHtml;

updateCartQuantity();
