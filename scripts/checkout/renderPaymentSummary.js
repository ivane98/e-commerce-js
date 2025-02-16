import { cart } from "../../data/cart.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { getProduct } from "../../data/products.js";

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

  console.log(totalPriceCents);
  console.log(shippingPriceCents);
  console.log(totalQuantity);

  paymentHtml += `
    <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$42.75</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$4.99</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$47.74</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$4.77</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$52.51</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
  `;

  document.querySelector(".payment-summary").innerHTML = paymentHtml;
}
