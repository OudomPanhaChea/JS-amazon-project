

// get tracking id
export let trackingId = JSON.parse(localStorage.getItem('trackingId')) || [];

export function setTrackingId(productId, orderId) {
  trackingId.push({
    productId,
    orderId
  })
  localStorage.setItem('trackingId', JSON.stringify(trackingId));
}

export function removeTrackingId() {
  localStorage.removeItem('trackingId');
}