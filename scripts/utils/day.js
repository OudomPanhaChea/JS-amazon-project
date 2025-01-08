
export function toMonthAndDate(dateString) {
  const date = new Date(dateString);
  const options = {
    month: 'short',
    day: '2-digit'
  }
  return date.toLocaleDateString('en-US', options);
}