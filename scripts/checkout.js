import { cart, deleteFromCart, updateQuantity } from '../data/cart.js';
import { products } from '../data/products.js'; 
import { formateCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from '../data/deliveryoptions.js'; 

// const today = dayjs();
// const deliveryDate = today.add(7, 'days');
// deliveryDate.format('dddd, MMMM D');
// console.log(deliveryDate.format('dddd, MMMM D'));

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

  const deliveryOptionId = cartItem.deliveryOptionId;

  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if(option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDay, 'days');
  const dateString = deliveryDate.format('dddd, MMMM, D'); // format date

  cartSummeryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
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

          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let HTML = '';
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDay, 'days');
    const dateString = deliveryDate.format('dddd, MMMM, D'); // format date
    const priceString = deliveryOption.priceCents === 0 ? 
      'FREE' : `$${formateCurrency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    HTML += `
      <div class="delivery-option">
        <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `
  });
  return HTML;
}

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

// save quantity (when pressing enter)
const qtyInputElement = document.querySelectorAll(".js-quantity-input");
qtyInputElement.forEach((input) => {
  input.addEventListener('keypress', (event) => {
    if(event.key === "Enter") {
      let productId = input.dataset.productId;

      savingQuantity(productId);
    }
  });
})

// save quantity (when clicking save)
const saveLinkElement = document.querySelectorAll(".js-save-link");
saveLinkElement.forEach((save) => {
  save.addEventListener('click', () => {
    let productId = save.dataset.productId; 

    savingQuantity(productId);
  });
});

function savingQuantity(productId) {
  const cartItemContainerElement = document.querySelector(`.js-cart-item-container-${productId}`);
  cartItemContainerElement.classList.remove("is-editing-quantity");

  const qtyLabelElement = document.querySelectorAll(`.js-quantity-label-${productId}`);
  qtyInputElement.forEach((input) => {
    if(input.dataset.productId === productId) {
      let quantity;
      if(input.value >= 0 && input.value <= 1000) {
        quantity = Number(input.value);
        if(quantity === 0) {
          deleteFromCart(productId);
        }
      }
      else {
        cart.forEach((cartItem) => {
          if(cartItem.productId === productId) {
            quantity = cartItem.quantity;
          }
        })
        // display error message
      }
      updateQuantity(productId, quantity); // this will update and save to localstorage

      // update quantity in each items (display HTML)
      qtyLabelElement.forEach((label) => {
        cart.forEach((cartItem) => {
          if(cartItem.productId === productId) {
            label.innerHTML = quantity;
          }
        });
      });
    }
  });
  displayCheckoutTotalQty();
}

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
