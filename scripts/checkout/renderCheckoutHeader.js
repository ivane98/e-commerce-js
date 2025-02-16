import { calculateCartQuantity } from "../../data/cart.js";

export function renderCheckoutHeader() {
  document.querySelector(".header-quantity").innerHTML =
    calculateCartQuantity();
}
