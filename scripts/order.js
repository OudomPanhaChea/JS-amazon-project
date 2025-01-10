
import { orders } from "./data/order.js";
import { getProducts, loadProductFetch } from "./data/products.js";
import { formateCurrency } from "./utils/money.js";
import { toMonthAndDate } from "./utils/day.js";
import { cart, addToCart, cartQuantityIncrement,  } from "./data/cart.js";

console.log(orders);

renderOrdering();

function renderOrdering() {
  loadingFromBackend(); // loading products from backend 
  async function loadingFromBackend() {
    try {
      await loadProductFetch();
    }
    catch(error) {
      console.log('error!')
    }
    ordersHistory();
  }

  // displaying cart total quantity
  let totalQty = JSON.parse(localStorage.getItem('totalQty')) || 0;

  let total = 0;
  cart.forEach((cartItem) => {
    total += cartItem.quantity;
    totalQty = total;
  });
  const cartQtyElement = document.querySelector('.js-cart-qty');
  if(cart.length === 0) {
    totalQty = 0;
  }
  cartQtyElement.innerHTML = totalQty;

  function ordersHistory() {
    let summaryOrderHTML = '';
    orders.forEach((order) => {
      let summaryProductHTML = productHistory(order);
      const orderTime = toMonthAndDate(order.orderTime);

      // const 

      summaryOrderHTML += `
        <div class="order-container"> 
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
              <div>${orderTime}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formateCurrency(order.totalCostCents)}</div>
            </div>
          </div>
          
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>
          
          <div class="order-details-grid js-order-details-grid-${order.id}">
            ${summaryProductHTML}
          </div>
        </div>
      `;
    });
    
  const orderContainerElement = document.querySelector('.js-order-grid');
    orderContainerElement.innerHTML = summaryOrderHTML;
  }

  function productHistory(order) {
    let summaryProductHTML = '';

    order.products.forEach((product) => {
      const productId = product.productId;
      const matchingProduct = getProducts(productId); 

      const arrivingDate = toMonthAndDate(product.estimatedDeliveryTime);

      summaryProductHTML += `
        <div class="product-image-container">
          <img src="${matchingProduct.image}">
        </div>
    
        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${arrivingDate}
          </div>
          <div class="product-quantity">
            Quantity: ${product.quantity}
          </div>
          <button 
            class="buy-again-button button-primary js-buy-again"
            data-product-id="${productId}"
          >
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
    
        <div class="product-actions">
          <a href="../tracking.html">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    return summaryProductHTML;
  }
  // clicked on buy again
  document.addEventListener('DOMContentLoaded', () => {
    const parentElement = document.body; // Use a stable parent element
    
    if (parentElement) {
      parentElement.addEventListener('click', (event) => {
        const button = event.target.closest('.js-buy-again');
        if (button) {
          console.log('hello');
          const {productId} = button.dataset;
          addToCart(productId);
          cartQuantityIncrement(productId, totalQty);

          renderOrdering();
        }
      });
    } else {
      console.log('Parent element not found');
    }
  });
}

