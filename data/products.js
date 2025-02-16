export let products = [];

export async function loadProducts(url) {
  let res = await fetch(url);
  let data = await res.json();
  products = data;
}

export function getProduct(id) {
  let match = products.find((product) => product.id === id);
  return match;
}
