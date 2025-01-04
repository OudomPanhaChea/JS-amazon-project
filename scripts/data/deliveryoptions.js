import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export const deliveryOptions = [{
  id: '1',
  deliveryDay: 7,
  priceCents: 0,
}, {
  id: '2',
  deliveryDay: 3,
  priceCents: 499,
}, {
  id: '3',
  deliveryDay: 1,
  priceCents: 999,
}]

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
  
  deliveryOptions.forEach((option) => {
    if(option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });
  
  return deliveryOption || deliveryOptions[0];
}

export function calculateDeliveryDate(deliveryOption) {
  // const today = dayjs();
  // const deliveryDate = today.add(deliveryOption.deliveryDay, 'day');

  let remainingDays = deliveryOption.deliveryDay; // it'll pass how many days
  let deliveryDate = dayjs(); // today

  while(remainingDays > 0) {
    deliveryDate = deliveryDate.add(1, 'day');
    if(!isWeekend(deliveryDate)) {
      remainingDays--;
    }
  }

  const dateString = deliveryDate.format('dddd, MMMM D'); // format date
  return dateString;
}

function isWeekend(date) {
  const dateOfWeek = date.format('dddd');
  return dateOfWeek === 'Saturday' || dateOfWeek === 'Sunday';
}
