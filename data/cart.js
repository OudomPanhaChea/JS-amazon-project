
export const cart = [];

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
      quantity: 1
    });
  }
}