import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import ProductModal from './ProductModal';
import SkeletonLoader from './SkeletonLoader';

const BestSeller = () => {
  const { products, isProductsLoading } = useContext(ShopContext);
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const bestsellers = products.filter((item) => item.bestseller).slice(0, 4);
  if (!isProductsLoading && bestsellers.length === 0) return null;
  return <section className="section">
    <div className="section-heading"><div><span className="eyebrow">{t('home.bestEyebrow')}</span><h2>{t('home.bestTitle')}</h2></div><p>{t('home.bestDescription')}</p></div>
    {isProductsLoading ? <SkeletonLoader count={4} /> : <div className="products-grid">{bestsellers.map((product, index) => <ProductItem key={product._id} product={product} index={index} onQuickView={setSelectedProduct} />)}</div>}
    <ProductModal product={selectedProduct} isOpen={Boolean(selectedProduct)} onClose={() => setSelectedProduct(null)} />
  </section>;
};

export default BestSeller;
