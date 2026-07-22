export const getLocalizedValue = (value, language = 'ar') => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[language] || value.ar || value.en || Object.values(value)[0] || '';
  }
  return value || '';
};

export const productName = (product, language) => getLocalizedValue(product?.name || product?.title, language);
export const productDescription = (product, language) => getLocalizedValue(product?.description, language);
export const productCategory = (product, language) => getLocalizedValue(product?.category, language);
export const productImages = (product) => product?.image || product?.images || [];
export const productSizes = (product) => product?.sizes || Object.keys(product?.prices || {});
export const productPrice = (product, size) => {
  if (size && product?.prices?.[size] != null) return product.prices[size];
  if (product?.price != null) return product.price;
  const prices = Object.values(product?.prices || {});
  return prices.length ? Math.min(...prices) : 0;
};
