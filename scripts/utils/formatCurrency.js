export function formatCurrency(currency) {
  return (Math.floor(currency) / 100).toFixed(2);
}
