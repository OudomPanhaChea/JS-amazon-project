
// Use pascal case by named it by capital 'C'
class Cart {
  #localStorageKey;
  cartItem = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];

  constructor(localStorageKey) { 
    this.#localStorageKey = localStorageKey;
  }

  saveToLocalStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItem));
  }

  addToCart(productId) {
    let matchingcartItem;
    this.cartItem.forEach((cartItem) => {
      if(productId === cartItem.productId) {
        matchingcartItem = cartItem;
      }
    });
    
    if(matchingcartItem) {
      matchingcartItem.quantity++;
    }
    else {
      this.cartItem.push({
        productId,
        quantity: 1,
        deliveryOptionId: '1',
      });
    }
    this.saveToLocalStorage();
  }

  // delete from cart
  deleteFromCart(productId) {
    const newCart = [];
  
    cart.forEach((cartItem) => {
      if(cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });
  
    this.cartItem = newCart;
  
    this.saveToLocalStorage();
  
    const cartItemContainerElement = document.querySelector(`.js-cart-item-container-${productId}`);
    cartItemContainerElement.remove();
  }

  updateQuantity(productId, quantity) {
    this.cartItem.forEach((cartItem) => {
      if(productId === cartItem.productId) {
        cartItem.quantity = quantity;
        this.saveToLocalStorage();
      }
    });
  }
  
  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingcartItem;
    this.cartItem.forEach((cartItem) => {
      if(productId === cartItem.productId) {
        matchingcartItem = cartItem;
      }
    });
  
    matchingcartItem.deliveryOptionId = deliveryOptionId;
  
    this.saveToLocalStorage();
  }
}

const cart = new Cart('cart-oop'); // cart-oop is the parameter of the class's constructor
const businessCart = new Cart('cart-business');

cart.addToCart('54e0eccd-8f36-462b-b68a-8182611d9add');
businessCart.addToCart('3ebe75dc-64d2-4137-8860-1f5a963e534b');
businessCart.addToCart('8c9c52b5-5a19-4bcb-a5d1-158a74287c53');
businessCart.addToCart('54e0eccd-8f36-462b-b68a-8182611d9add');

console.log(cart);
console.log(businessCart);
