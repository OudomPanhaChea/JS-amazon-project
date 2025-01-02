export let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
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