import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import CartTotal from '../components/CartTotal';

const initialForm = { firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: '' };
const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const [formData, setFormData] = useState(initialForm);
  const { t } = useTranslation();
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, invalidateProductCache } = useContext(ShopContext);
  const fields = [['firstName', 'text'], ['lastName', 'text'], ['email', 'email'], ['street', 'text', true], ['city', 'text'], ['state', 'text'], ['zipcode', 'text'], ['country', 'text'], ['phone', 'tel', true]];
  const submit = async (event) => {
    event.preventDefault();
    if (!token) { navigate('/login'); return; }
    const items = Object.entries(cartItems).flatMap(([productId, sizes]) => Object.entries(sizes || {}).filter(([, quantity]) => quantity > 0).map(([size, quantity]) => { const product = products.find((item) => item._id === productId); return product ? { ...product, size, quantity } : null; })).filter(Boolean);
    if (!items.length) { navigate('/cart'); return; }
    const orderData = { userId: token, address: formData, items, amount: getCartAmount() + delivery_fee };
    try {
      if (method === 'cod') {
        const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } });
        if (!response.data.success) throw new Error(response.data.message);
        setCartItems({}); invalidateProductCache(); toast.success(t('checkout.orderSuccess')); navigate('/orders'); return;
      }
      if (method === 'stripe') {
        const response = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } });
        if (!response.data.success) throw new Error(response.data.message);
        window.location.assign(response.data.session_url);
        return;
      }
      const response = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { token } });
      if (!response.data.success) throw new Error(response.data.message);
      if (!window.Razorpay) throw new Error('Razorpay is unavailable');
      const order = response.data.order;
      new window.Razorpay({ key: import.meta.env.VITE_RAZORPAY_KEY_ID, amount: order.amount, currency: order.currency, name: 'Black & White', description: 'Order payment', order_id: order.id, handler: () => { setCartItems({}); invalidateProductCache(); navigate('/orders'); } }).open();
    } catch (error) { console.error(error); toast.error(error.message || t('checkout.orderError')); }
  };
  return <main className="page-container page-content"><span className="eyebrow">Black & White</span><h1 className="page-heading">{t('checkout.title')}</h1><form className="split-page" onSubmit={submit}><section className="checkout-form premium-card"><h2 className="form-title">{t('checkout.deliveryInformation')}</h2><div className="form-grid">{fields.map(([name, type, full]) => <input className={`glass-input ${full ? 'full' : ''}`} key={name} name={name} type={type} value={formData[name]} onChange={(event) => setFormData((current) => ({ ...current, [name]: event.target.value }))} placeholder={t(`checkout.${name}`)} required />)}</div></section><aside><CartTotal /><section className="checkout-form premium-card" style={{ marginTop: '14px' }}><h2 className="form-title">{t('checkout.paymentMethod')}</h2><div className="payment-options">{['stripe', 'razorpay', 'cod'].map((option) => <label className={`payment-option ${method === option ? 'selected' : ''}`} key={option}><input type="radio" name="payment" value={option} checked={method === option} onChange={() => setMethod(option)} hidden /><span className="payment-indicator" />{option === 'cod' ? t('checkout.cashOnDelivery') : option === 'stripe' ? 'Stripe' : 'Razorpay'}</label>)}</div><button className="premium-button" type="submit" style={{ width: '100%', marginTop: '18px' }}>{t('checkout.placeOrder')}</button></section></aside></form></main>;
};

export default PlaceOrder;
