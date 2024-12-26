// products.js
import { products } from '../data/products.js';
// cart.js
import { cart, addToCart } from '../data/cart.js';

let productHTML = '';

products.forEach((product) => {
  productHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${(product.priceCents/100).toFixed(2)}
      </div>

      <div 
        class="product-quantity-container
        data-product-id=""${product.id}"
      ">
        <select 
          class="js-select-qty-${product.id}"
        >
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-addedToCart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button 
        class="add-to-cart-button button-primary js-addToCart"
        data-product-id="${product.id}
      ">
        Add to Cart
      </button>
    </div>
  `;
});  

// Display products
const displayProHTML = document.querySelector('.js-product-grid');
displayProHTML.innerHTML = productHTML;

// Cart quantity increment
function cartQuantityIncrement(productId) {
  let cartQuantity = 0;
    
  cart.forEach((cartItem) => {
    if(cartItem.productId === productId) {
      const selectQtyElement = document.querySelectorAll(`.js-select-qty-${productId}`);
      selectQtyElement.forEach((select) => {
        cartItem.quantity += Number(select.value) - 1;
        select.value = 1; // to make sure the value is back to 1
      });
    }
    cartQuantity += cartItem.quantity;
  });
  // update cart quantity
  const cartQtyElement = document.querySelector('.js-cartQty');
  cartQtyElement.innerHTML = cartQuantity;
}

// Added to cart message
function addedToCartMessage(productId) {
  const addedToCartElement = document.querySelectorAll(`.js-addedToCart-${productId}`);
  addedToCartElement.forEach((element) => {
    element.style.opacity = 1;

    let timer;
    timer = 
    setTimeout(() => {
      element.style.opacity = 0;
    }, 2000);

    button.addEventListener('click', () => {
      clearTimeout(timer);
    });
  });
}

const addToCartElement = document.querySelectorAll('.js-addToCart');
addToCartElement.forEach((button) => {
  button.addEventListener('click', () => {
    // const productId = button.dataset.productId;
    const { productId } = button.dataset; // destructuring
    addToCart(productId);
    cartQuantityIncrement(productId);
    addedToCartMessage(productId);
  });
});
