import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { productImages, productName } from '../utils/productData';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [openOrder, setOpenOrder] = useState(null);
  const loadOrders = async () => { if (!token) return; try { const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } }); if (response.data.success) setOrders(response.data.orders || []); } catch (error) { console.error(error); } };
  useEffect(() => { loadOrders(); }, [token]);
  return <main className="page-container page-content"><span className="eyebrow">Black & White</span><h1 className="page-heading">{t('orders.title')}</h1>{!orders.length ? <section className="premium-card empty-state"><p>{t('orders.empty')}</p></section> : <section className="order-list">{orders.map((order) => { const id = order._id || order.id; const open = openOrder === id; return <article className="order-card premium-card" key={id}><div className="order-summary" onClick={() => setOpenOrder(open ? null : id)}><div><span className="eyebrow">{t('orders.order')} #{String(id).slice(-8)}</span><h2>{new Date(order.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')}</h2></div><div style={{ textAlign: 'end' }}><strong className="order-status">{order.status}</strong><p className="product-price">{currency}{Number(order.amount || 0).toFixed(2)}</p></div></div>{open && <div className="order-details">{(order.items || []).map((item, index) => <div className="order-product" key={`${item._id}-${index}`}><img src={productImages(item)[0]} alt={productName(item, i18n.language)} loading="lazy" /><span>{productName(item, i18n.language)} · {t('orders.quantity')}: {item.quantity}</span><strong>{currency}{item.price}</strong></div>)}<div className="total-row"><span>{t('orders.payment')}</span><span>{order.paymentMethod}</span></div><button className="premium-button-outline" onClick={loadOrders}>{t('orders.trackOrder')}</button></div>}</article>; })}</section>}</main>;
};

export default Orders;
