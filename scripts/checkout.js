import { cart, deleteFromCart, updateQuantity } from '../data/cart.js';
import { products } from '../data/products.js'; 
import { formateCurrency } from './utils/money.js';

displayCheckoutTotalQty();

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
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span 
              class="update-quantity-link link-primary js-update-link"
              data-product-id="${matchingProduct.id}"
            >
              Update
            </span>
            <input class="quantity-input js-quantity-input" data-product-id="${matchingProduct.id}" type="text">
            <span 
              class="save-quantity-link link-primary js-save-link"
              data-product-id="${matchingProduct.id}"
            >
              save
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

// Display HTML elements on checkout
function displayHTML() {
  const orderSummaryElement = document.querySelector('.js-orderSummary');
  orderSummaryElement.innerHTML = cartSummeryHTML;
}

displayHTML();

// delete from cart
const deleteLinksElement = document.querySelectorAll('.js-delete-link');
deleteLinksElement.forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    deleteFromCart(productId);

    const cartItemContainerElement = document.querySelector(`.js-cart-item-container-${productId}`);
    cartItemContainerElement.remove();
    displayCheckoutTotalQty();
    if(cart.length === 0) {
      window.location.href = 'amazon.html';
    }
  });
});

// update quantity (when clicking update)
const updateLinkElement = document.querySelectorAll('.js-update-link');
updateLinkElement.forEach((update) => {
  update.addEventListener('click', () => {
    let productId = update.dataset.productId;

    const cartItemContainerElement = document.querySelector(`.js-cart-item-container-${productId}`);
    cartItemContainerElement.classList.add("is-editing-quantity");
  });
});

// save quantity (when clicking save)
const saveLinkElement = document.querySelectorAll(".js-save-link");
saveLinkElement.forEach((save) => {
  save.addEventListener('click', () => {
    let productId = save.dataset.productId; 

    const cartItemContainerElement = document.querySelector(`.js-cart-item-container-${productId}`);
    cartItemContainerElement.classList.remove("is-editing-quantity");

    const qtyInputElement = document.querySelectorAll(".js-quantity-input");
    const qtyLabelElement = document.querySelectorAll(`.js-quantity-label-${productId}`);
    qtyInputElement.forEach((input) => {
      if(input.dataset.productId === productId) {
        const quantity = Number(input.value);
        updateQuantity(productId, quantity); // this will update and save to localstorage
        // update quantity in each items
        qtyLabelElement.forEach((label) => {
          cart.forEach((cartItem) => {
            if(cartItem.productId === productId) {
              label.innerHTML = quantity;
            }
          });
        });
      }
    });
    // displayHTML();
    displayCheckoutTotalQty();
  });
});

// Update and display quantity in checkout.html
function displayCheckoutTotalQty() {
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
