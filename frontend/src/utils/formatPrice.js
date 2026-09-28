const formatPrice = (price) => {
  return `$${Number(price || 0).toFixed(2)}`;
};

export default formatPrice;
