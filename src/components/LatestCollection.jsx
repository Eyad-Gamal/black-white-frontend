import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import ProductModal from './ProductModal';
import SkeletonLoader from './SkeletonLoader';

const LatestCollection = () => {
  const { products, isProductsLoading } = useContext(ShopContext);
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  return <section className="section">
    <div className="section-heading"><div><span className="eyebrow">{t('home.latestEyebrow')}</span><h2>{t('home.latestTitle')}</h2></div><p>{t('home.latestDescription')}</p></div>
    {isProductsLoading ? <SkeletonLoader /> : <div className="products-grid">{products.slice(0, 8).map((product, index) => <ProductItem key={product._id} product={product} index={index} onQuickView={setSelectedProduct} />)}</div>}
    <div style={{ textAlign: 'center', marginTop: '30px' }}><Link className="premium-button-outline" to="/collection">{t('home.viewAll')}</Link></div>
    <ProductModal product={selectedProduct} isOpen={Boolean(selectedProduct)} onClose={() => setSelectedProduct(null)} />
  </section>;
};

export default LatestCollection;
