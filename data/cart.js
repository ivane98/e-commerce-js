import { getProduct } from "./products.js";
export let cart = JSON.parse(localStorage.getItem("cart")) || [];

export function addToCart(id) {
  let match = getProduct(id);

  let quantity = Number(document.querySelector(`.quantity-${id}`)?.value) || 1;

  if (cart.match) {
    cart.match.quantity += quantity;
  } else {
    cart.push({
      productId: match.id,
      quantity,
      deliveryOption: "1",
    });
  }

  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function calculateCartQuantity() {
  let count = 0;

  cart.forEach((item) => {
    count += item.quantity;
  });
  return count;
}

export function updateCartQuantity() {
  document.querySelector(".cart-quantity").innerHTML = calculateCartQuantity();
}

export function removeFromCart(id) {
  cart = cart.filter((cartItem) => cartItem.productId !== id);
  saveToStorage();
}

export function updateDeliveryOptions(productId, deliveryOptionId) {
  let match;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      match = cartItem;
    }
  });
  match.deliveryOption = deliveryOptionId;
  saveToStorage();
}
