import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import { productDescription, productImages, productName, productPrice, productSizes } from '../utils/productData';

const ProductModal = ({ product, isOpen, onClose }) => {
  const { addToCart, currency, navigate } = useContext(ShopContext);
  const { t, i18n } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const images = productImages(product);
  const sizes = productSizes(product);
  useEffect(() => { setSelectedImage(0); setSelectedSize(''); }, [product?._id, isOpen]);
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);
  if (!isOpen || !product) return null;
  const add = async () => {
    if (!selectedSize) return toast.error(t('product.selectSizeError'));
    await addToCart(product._id, selectedSize);
    toast.success(t('product.added'));
    onClose();
  };
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="product-modal" role="dialog" aria-modal="true" aria-label={productName(product, i18n.language)}>
      <button className="icon-button modal-close" onClick={onClose} aria-label={t('common.close')}>×</button>
      <div className="modal-gallery"><img className="modal-main-image" src={images[selectedImage]} alt={productName(product, i18n.language)} />
        {images.length > 1 && <div className="modal-thumbnails">{images.map((image, index) => <button className={`modal-thumbnail ${index === selectedImage ? 'active' : ''}`} key={image} onClick={() => setSelectedImage(index)}><img src={image} alt="" loading="lazy" /></button>)}</div>}
      </div>
      <div className="modal-details"><span className="eyebrow">{product.category}</span><h2>{productName(product, i18n.language)}</h2><p className="detail-price">{currency}{productPrice(product, selectedSize)}</p><p className="modal-description">{productDescription(product, i18n.language)}</p>
        <strong>{t('product.selectSize')}</strong><div className="size-options">{sizes.map((size) => <button className={`size-option ${selectedSize === size ? 'selected' : ''}`} key={size} onClick={() => setSelectedSize(size)}>{size}</button>)}</div>
        <button className="premium-button modal-cart-button" onClick={add}>{t('product.addToCart')}</button>
        <button className="text-link" style={{ marginTop: '16px' }} onClick={() => { onClose(); navigate(`/product/${product._id}`); }}>{t('product.viewProduct')}</button>
      </div>
    </section>
  </div>;
};

export default ProductModal;
