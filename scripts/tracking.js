import { loadProductFetch, products } from "./data/products.js";
import { cart } from "./data/cart.js";
import { orders } from "./data/order.js";
import { trackingId, removeTrackingId } from "./data/trackingId.js";
import { toDayMonthAndDate, toMonthAndDate } from "./utils/day.js";
import { getProducts } from "./data/products.js";

reloadProductFromBackend();
async function reloadProductFromBackend() {
  try {
    await loadProductFetch();
  }
  catch(error) {
    console.log(error);
  }
  renderTrackingPage();
}

// display total cart qty
let totalQty = JSON.parse(localStorage.getItem('totalQty')) || 0;

let total = 0;
cart.forEach((cartItem) => {
  total += cartItem.quantity;
  totalQty = total;
});
const cartQtyElement = document.querySelector('.js-cartQty');
if(cart.length === 0) {
  totalQty = 0;
}
cartQtyElement.innerHTML = totalQty;

function renderTrackingPage() {
  
  orders.forEach((order) => {
    order.products.forEach((product) => {
      const {productId} = product;
  
      trackingId.forEach((tracking) => {
        if(tracking.productId === productId && tracking.orderId === order.id) {
          const arrivingDate = toDayMonthAndDate(product.estimatedDeliveryTime);
          const orderedDate = toDayMonthAndDate(order.orderTime);
          
          // get days process
          const ordered = new Date(orderedDate);
          const willArrived = new Date(arrivingDate);
          const miliSecSubstact = (willArrived.getTime() - ordered.getTime());
          const convertToDay = Math.ceil(miliSecSubstact / (1000 * 60 * 60 * 24));
          
          const today = toDayMonthAndDate(new Date());
          const now = new Date(today);
          const nowToDays = now.getTime() - ordered.getTime();
          const todaytoDays = Math.ceil(nowToDays / (1000 * 60 * 60 * 24));

          const dayLeft = convertToDay - todaytoDays; // result

          const {productId} = tracking;
          const {quantity} = product;
          
          displayTrackingProduct(arrivingDate, productId, quantity, dayLeft, convertToDay);
        }
      });
    });
  });
  
  function displayTrackingProduct(arrivingDate, productId, quantity, dayLeft, convertToDay) {

    const matchingProduct = getProducts(productId);

    let summaryTrackingHTML = '';
    
    summaryTrackingHTML += `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
    
      <div class="delivery-date">
        Arriving on ${arrivingDate}
      </div>
    
      <div class="product-info">
        ${matchingProduct.name}
      </div>
    
      <div class="product-info">
        Quantity: ${quantity}
      </div>
    
      <img class="product-image" src="${matchingProduct.image}">
    
      <div class="progress-labels-container">
        <div class="progress-label">
          Preparing
        </div>
        <div class="progress-label current-status">
          Shipped
        </div>
        <div class="progress-label">
          Delivered
        </div>
      </div>
    
      <div class="progress-bar-container">
        <div class="progress-bar" data-done="100"></div>
        <div class="progress-bar-done" data-done="100"></div>
      </div>
    `;

    // update HTML
    const trackingOrderElement = document.querySelector('.js-tracking-order');
    trackingOrderElement.innerHTML = summaryTrackingHTML;

    // progress bar
    let progressDays = (convertToDay - dayLeft);
    let progressing = (50 + ((progressDays/convertToDay) * 50));
    let width = 50;
    setInterval(frame, 700);
    const progressBarElement = document.querySelector('.progress-bar');
    function frame() {
      if(width > progressing) {
        progressBarElement.style.transition = "none";
        width = 50;
      }
      else {
        width += (progressing - 50) / 3;
        progressBarElement.style.transition = "all .2s ease";
        progressBarElement.style.width = width + '%';
      }
    }
  }
}


const orderLinkElement = document.querySelector('.js-order-link');
orderLinkElement.addEventListener('click', () => {
  removeTrackingId();
})

const cartLinkElement = document.querySelector('.js-cart-link');
cartLinkElement.addEventListener('click', () => {
  removeTrackingId();
})

const logoElement = document.querySelector('.js-logo');
logoElement.addEventListener('click', () => {
  removeTrackingId();
})