import { cart } from "../data/cart.js";
import { getProducts } from "../data/products.js";
import { getDeliveryOption } from "../data/deliveryoptions.js";
import { formateCurrency } from "../utils/money.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let totalItem = 0;

  cart.forEach((cartItem) => {
    const product = getProducts(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;

    totalItem += cartItem.quantity;
  });
  
  let displayTotalItem = totalItem = totalItem > 1 ? `Items (${totalItem}):` : `Item (${totalItem}):`;

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>
    
    <div class="payment-summary-row">
      <div class="js-items-count">${displayTotalItem}</div>
      <div class="payment-summary-money">$${formateCurrency(
        productPriceCents
      )}</div>
    </div>
    
    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formateCurrency(
        shippingPriceCents
      )}</div>
    </div>
    
    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formateCurrency(
        totalBeforeTaxCents
      )}</div>
    </div>
    
    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formateCurrency(taxCents)}</div>
    </div>
    
    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formateCurrency(totalCents)}</div>
    </div>
    
    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  const paymentSummaryElement = document.querySelector(".js-paymentSummary");
  paymentSummaryElement.innerHTML = paymentSummaryHTML;
}

