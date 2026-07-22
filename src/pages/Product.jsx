import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import SkeletonLoader from '../components/SkeletonLoader';
import ProductModal from '../components/ProductModal';
import imageOptimizer from '../utils/imageOptimizer';
import { productDescription, productImages, productName, productPrice, productSizes } from '../utils/productData';

const Product = () => {
  const { productId } = useParams();
  const { products, isProductsLoading, currency, addToCart } = useContext(ShopContext);
  const { t, i18n } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [showModal, setShowModal] = useState(false);
  const product = products.find((item) => item._id === productId);
  const images = productImages(product);
  const sizes = productSizes(product);
  useEffect(() => { setSelectedImage(0); setSelectedSize(''); }, [productId]);
  if (isProductsLoading && !product) return <main className="page-container page-content"><SkeletonLoader count={4} /></main>;
  if (!product) return <main className="page-container page-content"><section className="premium-card empty-state"><p>{t('collection.noProducts')}</p></section></main>;
  const add = async () => { if (!selectedSize) return toast.error(t('product.selectSizeError')); const didAdd = await addToCart(product._id, selectedSize); if (didAdd) toast.success(t('product.added')); };
  return <main className="page-container page-content"><div className="detail-grid"><section><img className="detail-image" src={images[selectedImage]} srcSet={imageOptimizer.generateSrcSet(images[selectedImage], [640, 1024, 1600])} sizes="(max-width: 767px) 100vw, 55vw" alt={productName(product, i18n.language)} />{images.length > 1 && <div className="detail-thumbnails">{images.map((image, index) => <button key={image} className={`detail-thumb ${index === selectedImage ? 'selected' : ''}`} onClick={() => setSelectedImage(index)}><img src={image} alt="" loading="lazy" /></button>)}</div>}</section><section className="detail-info premium-card"><span className="eyebrow">{product.category}</span><h1>{productName(product, i18n.language)}</h1><p className="detail-price">{currency}{productPrice(product, selectedSize)}</p><p className="modal-description">{productDescription(product, i18n.language)}</p><strong>{t('product.selectSize')}</strong><div className="size-options">{sizes.map((size) => <button className={`size-option ${selectedSize === size ? 'selected' : ''}`} key={size} onClick={() => setSelectedSize(size)}>{size}</button>)}</div><button className="premium-button modal-cart-button" onClick={add}>{t('product.addToCart')}</button><button className="premium-button-outline" style={{ width: '100%', marginTop: '10px' }} onClick={() => setShowModal(true)}>{t('product.quickView')}</button><hr style={{ borderColor: 'var(--border-subtle)', margin: '25px 0' }} /><p className="muted">{t('product.care')}</p></section></div><RelatedProducts category={product.category} subCategory={product.subCategory} currentProductId={product._id} /><ProductModal product={product} isOpen={showModal} onClose={() => setShowModal(false)} /></main>;
};

export default Product;
