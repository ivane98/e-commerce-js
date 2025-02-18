import {
  cart,
  removeFromCart,
  updateCartQuantity,
  updateDeliveryOptions,
} from "../../data/cart.js";
import { getProduct, loadProducts, products } from "../../data/products.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
await loadProducts("https://supersimplebackend.dev/products");
import dayjs from "https://unpkg.com/dayjs@1.11.13/esm/index.js";
import { renderCheckoutHeader } from "./renderCheckoutHeader.js";
import { renderPaymentSummary } from "./renderPaymentSummary.js";

export function renderOrderSummary() {
  let orderHtml = ``;

  cart.forEach((cartItem) => {
    let matchingProduct = getProduct(cartItem.productId);
    let deliveryOption = getDeliveryOption(cartItem.deliveryOption);

    const today = dayjs();

    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    orderHtml += `
    <div class="cart-item-container">
            <div class="delivery-date">Delivery date: ${dateString}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src=${matchingProduct.image}
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">$${formatCurrency(
                  matchingProduct.priceCents
                )}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label">${
                    cartItem.quantity
                  }</span> </span>


                  <span class="update-quantity-link link-primary" data-product-id=${
                    matchingProduct.id
                  }>
                    Update
                  </span>

                  
                  <input type='text' class='quantity-input js-input-${
                    matchingProduct.id
                  }' />
                    <span data-product-id="${
                      matchingProduct.id
                    }" class='save-quantity-link link-primary'>Save</span>


                  <span class="delete-quantity-link link-primary" data-product-id=${
                    matchingProduct.id
                  }>
                    Delete
                  </span>

                  
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHtml(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
    `;
  });
  document.querySelector(".order-summary").innerHTML = orderHtml;

  document.querySelectorAll(".delivery-option-input").forEach((link) =>
    link.addEventListener("click", () => {
      let { productId, deliveryoptionId } = link.dataset;
      updateDeliveryOptions(productId, deliveryoptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  );

  document.querySelectorAll(".update-quantity-link").forEach((link) =>
    link.addEventListener("click", () => {
      let { productId } = link.dataset;
      link.style.display = "none";

      document.querySelector(`.js-input-${productId}`).style.display =
        "initial";

      document.querySelector(`.save-quantity-link`).style.display = "initial";

      document
        .querySelector(".save-quantity-link")
        .addEventListener("click", () => {
          let inputValue =
            Number(document.querySelector(`.js-input-${productId}`).value) || 1;

          cart.forEach((cartItem) => {
            if (cartItem.productId === productId) {
              cartItem.quantity = inputValue;
            }
          });
          localStorage.setItem("cart", JSON.stringify(cart));
          renderOrderSummary();
          renderPaymentSummary();
        });
    })
  );

  document.querySelectorAll(".delete-quantity-link").forEach((link) =>
    link.addEventListener("click", () => {
      let { productId } = link.dataset;
      removeFromCart(productId);
      renderOrderSummary();
      renderCheckoutHeader();
      renderPaymentSummary();
    })
  );
}

function deliveryOptionsHtml(matchingProduct, cartItem) {
  let html = "";

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();

    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    const priceString =
      deliveryOption.priceCents === 0
        ? "FREE"
        : `$${formatCurrency(deliveryOption.priceCents)}`;

    const isChecked = deliveryOption.id === cartItem.deliveryOption;

    html += `
  <div class="delivery-option">
                  <input
                    type="radio"
                    ${isChecked ? "checked" : ""}
                    class="delivery-option-input"
                    data-product-id=${matchingProduct.id}
                    data-deliveryOption-id=${deliveryOption.id}
                    name="delivery-option-${matchingProduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">${dateString}</div>
                    <div class="delivery-option-price">${priceString} Shipping
                    </div>
                  </div>
                  </div>
  `;
  });

  return html;
}
