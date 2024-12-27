import { cart, deleteFromCart, saveToLocalStorage } from '../data/cart.js';
import { products } from '../data/products.js'; 
import { formateCurrency } from './utils/money.js';


displayCheckout();

let cartSummeryHTML = '';

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;
  products.forEach((product) => {
    if(product.id === productId) {
      matchingProduct = product;
    }
  });

  cartSummeryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Wednesday, June 15
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formateCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span 
              class="delete-quantity-link link-primary js-delete-link"
              data-product-id="${matchingProduct.id}"
            >
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>

          <div class="delivery-option">
            <input type="radio" class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" checked class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

const orderSummaryElement = document.querySelector('.js-orderSummary');
orderSummaryElement.innerHTML = cartSummeryHTML;

const deleteLinksElement = document.querySelectorAll('.js-delete-link');
deleteLinksElement.forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    deleteFromCart(productId);

    const cartItemContainerElement = document.querySelector(`.js-cart-item-container-${productId}`);
    cartItemContainerElement.remove();
    displayCheckout();
    if(cart.length === 0) {
      window.location.href = 'amazon.html';
    }
  });
});

// Update quantity in checkout.html
function displayCheckout() {
  let totalQty = 0;
  const checkoutQtyElement = document.querySelector('.js-checkoutQty');
  const itemCountElement = document.querySelector('.js-items-count');
  cart.forEach((cartItem) => {
    totalQty += cartItem.quantity;
  });
  if(totalQty > 1) {
    checkoutQtyElement.innerHTML = totalQty + ' items';
    itemCountElement.innerHTML = `Items (${totalQty}):`;
  }
  else {
    checkoutQtyElement.innerHTML = totalQty + ' item';
    itemCountElement.innerHTML = `Item (${totalQty}):`;
  }
}