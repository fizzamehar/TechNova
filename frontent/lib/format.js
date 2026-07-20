const SHIPPING_FEE = 250;
function formatPKR(amount) {
  return `Rs ${Math.round(amount).toLocaleString("en-PK")}`;
}
function discountPercent(price, discountPrice) {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round((price - discountPrice) / price * 100);
}
export {
  discountPercent,
  formatPKR,
  SHIPPING_FEE
};
