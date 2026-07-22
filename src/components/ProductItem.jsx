import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productImages, productName, productPrice, productCategory } from '../utils/productData';
import imageOptimizer from '../utils/imageOptimizer';
import { ShopContext } from '../context/ShopContext';

const ProductItem = ({ product, id, image, name, price, category, onQuickView, index = 0 }) => {
  const { t, i18n } = useTranslation();
  const { currency } = useContext(ShopContext);
  const [loaded, setLoaded] = useState(false);
  const item = product || { _id: id, image, name, price, category };
  const images = productImages(item);
  const title = productName(item, i18n.language);
  return <article className="product-card" style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}>
    <Link className="product-image-link" to={`/product/${item._id}`} aria-label={title}>
      <img className={loaded ? '' : 'loading'} src={images[0]} srcSet={imageOptimizer.generateSrcSet(images[0], [320, 640, 960])} sizes="(max-width: 639px) 50vw, (max-width: 1024px) 50vw, 25vw" alt={title} loading="lazy" onLoad={() => setLoaded(true)} onError={(event) => { event.currentTarget.style.opacity = '.25'; }} />
    </Link>
    <div className="product-info">
      {productCategory(item, i18n.language) && <div className="product-category">{productCategory(item, i18n.language)}</div>}
      <Link className="product-name" to={`/product/${item._id}`}>{title}</Link>
      <div className="product-price-row"><strong className="product-price">{currency}{price === undefined ? productPrice(item) : price}</strong>{onQuickView && <button className="quick-view" onClick={() => onQuickView(item)}>{t('product.quickView')}</button>}</div>
    </div>
  </article>;
};

export default ProductItem;
