export let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function saveTotalQty(totalQty) {
  localStorage.setItem('totalQty', JSON.stringify(totalQty));
}

// Add to cart
export function addToCart(productId) {
  let matchingcartItem;
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      matchingcartItem = cartItem;
    }
  });
  
  if(matchingcartItem) {
    matchingcartItem.quantity++;
  }
  else {
    cart.push({
      productId,
      quantity: 1,
      deliveryOptionId: '1',
    });
  }
  saveToLocalStorage();
}

// delete from cart
export function deleteFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if(cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToLocalStorage();

  const cartItemContainerElement = document.querySelector(`.js-cart-item-container-${productId}`);
  cartItemContainerElement.remove();
}

// Cart quantity increment
export function cartQuantityIncrement(productId, totalQty) {
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
  if(cartQtyElement) {
    cartQtyElement.innerHTML = cartQuantity;
  }

  totalQty = cartQuantity;

  saveTotalQty(totalQty);
  saveToLocalStorage();
}

export function updateQuantity(productId, quantity) {
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      cartItem.quantity = quantity;
      saveToLocalStorage();
    }
  });
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingcartItem;
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      matchingcartItem = cartItem;
    }
  });

  matchingcartItem.deliveryOptionId = deliveryOptionId;

  saveToLocalStorage();
}