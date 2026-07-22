import { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import ProductModal from './ProductModal';

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products } = useContext(ShopContext);
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const related = useMemo(() => products.filter((item) => item._id !== currentProductId && item.category === category && (!subCategory || item.subCategory === subCategory)).slice(0, 4), [products, category, subCategory, currentProductId]);
  if (!related.length) return null;
  return <section className="section"><div className="section-heading"><div><span className="eyebrow">Black & White</span><h2>{t('product.relatedProducts')}</h2></div></div><div className="products-grid">{related.map((product, index) => <ProductItem key={product._id} product={product} index={index} onQuickView={setSelectedProduct} />)}</div><ProductModal product={selectedProduct} isOpen={Boolean(selectedProduct)} onClose={() => setSelectedProduct(null)} /></section>;
};

export default RelatedProducts;
