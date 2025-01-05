import { renderOrderSummary  } from "./checkout/orderSummary.js";
import { renderPaymentSummary  } from "./checkout/paymentSummary.js";
import { loadProduct, loadProductFetch } from "./data/products.js";
// import './data/cart-oop.js';
// import './data/car.js';
// import './data/backend-practice.js'

Promise.all([
  loadProductFetch(),
]).then(() => {
  renderOrderSummary();
  renderPaymentSummary();
});
