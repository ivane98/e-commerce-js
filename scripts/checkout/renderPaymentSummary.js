import { cart } from "../../data/cart.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { addOrder } from "../../data/orders.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/formatCurrency.js";

export function renderPaymentSummary() {
  let paymentHtml = "";

  let totalPriceCents = 0;
  let shippingPriceCents = 0;
  let totalQuantity = 0;

  cart.forEach((cartItem) => {
    let match = getProduct(cartItem.productId);
    totalPriceCents += match.priceCents * cartItem.quantity;
    shippingPriceCents += getDeliveryOption(cartItem.deliveryOption).priceCents;
    totalQuantity += cartItem.quantity;
  });

  let totalBeforeTax = totalPriceCents + shippingPriceCents;
  let estimatedTax = (totalBeforeTax * 10) / 100;
  let totalPrice = totalBeforeTax + estimatedTax;

  paymentHtml += `
    <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (${totalQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(
              shippingPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalBeforeTax
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(
              estimatedTax
            )}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalPrice
            )}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
  `;

  document.querySelector(".payment-summary").innerHTML = paymentHtml;

  document
    .querySelector(".place-order-button")
    .addEventListener("click", async () => {
      let res = await fetch("https://supersimplebackend.dev/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cart,
        }),
      });
      let body = await res.json();
      addOrder(body);
      window.location.href = "orders.html";
    });
}
