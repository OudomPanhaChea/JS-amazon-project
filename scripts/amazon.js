import { cart } from '../data/cart.js';
import { products } from '../data/products.js';

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

const displayProHTML = document.querySelector('.js-product-grid');
displayProHTML.innerHTML = productHTML;

const addToCartElement = document.querySelectorAll('.js-addToCart');
addToCartElement.forEach((button) => {
  button.addEventListener('click', () => {
    // const productId = button.dataset.productId;
    const { productId } = button.dataset; // destructuring
    
    let matchingItem;
    cart.forEach((item) => {
      if(productId === item.productId) {
        matchingItem = item;
      }
    });
    
    if(matchingItem) {
      matchingItem.quantity++;
    }
    else {
      cart.push({
        productId,
        quantity: 1
      });
    }

    let cartQuantity = 0;
    
    cart.forEach((item) => {
      if(item.productId === productId) {
        const selectQtyElement = document.querySelectorAll(`.js-select-qty-${productId}`);
        selectQtyElement.forEach((select) => {
          item.quantity += Number(select.value) - 1;
          select.value = 1; // to make sure the value is back to 1
        });
      }
      cartQuantity += item.quantity;
    });

    const cartQtyElement = document.querySelector('.js-cartQty');
    cartQtyElement.innerHTML = cartQuantity;

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
  });
});
