import { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShopContext } from '../context/ShopContext';
import CartTotal from '../components/CartTotal';
import { productImages, productName, productPrice } from '../utils/productData';

const Cart = () => {
  const { products, cartItems, currency, updateQuantity } = useContext(ShopContext);
  const { t, i18n } = useTranslation();
  const items = useMemo(() => Object.entries(cartItems).flatMap(([productId, sizes]) => Object.entries(sizes || {}).filter(([, quantity]) => quantity > 0).map(([size, quantity]) => ({ product: products.find((item) => item._id === productId), productId, size, quantity }))).filter((item) => item.product), [cartItems, products]);
  return <main className="page-container page-content"><span className="eyebrow">Black & White</span><h1 className="page-heading">{t('cart.title')}</h1>{!items.length ? <section className="premium-card empty-state"><p>{t('cart.empty')}</p><Link className="premium-button" to="/collection">{t('cart.continueShopping')}</Link></section> : <div className="split-page"><section className="cart-items">{items.map(({ product, productId, size, quantity }) => <article className="cart-item premium-card" key={`${productId}-${size}`}><img src={productImages(product)[0]} alt={productName(product, i18n.language)} loading="lazy" /><div><h2 className="cart-item-title">{productName(product, i18n.language)}</h2><div className="cart-item-meta">{t('cart.size')}: {size}</div><strong className="product-price">{currency}{productPrice(product, size)}</strong></div><div className="cart-item-actions"><label className="muted" htmlFor={`${productId}-${size}`}>{t('cart.quantity')}</label><input id={`${productId}-${size}`} className="quantity-input" value={quantity} type="number" min="1" onChange={(event) => { const next = Number(event.target.value); if (next > 0) updateQuantity(productId, size, next); }} /><button className="remove-button" onClick={() => updateQuantity(productId, size, 0)}>{t('cart.remove')}</button></div></article>)}</section><aside><CartTotal /><Link className="premium-button" style={{ width: '100%', marginTop: '13px' }} to="/place-order">{t('cart.checkout')}</Link></aside></div>}</main>;
};

export default Cart;
