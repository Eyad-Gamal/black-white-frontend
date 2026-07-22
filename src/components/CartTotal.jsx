import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const { t } = useTranslation();
  const subtotal = getCartAmount();
  const total = subtotal ? subtotal + delivery_fee : 0;
  return <section className="totals premium-card"><h2>{t('cart.cartTotal')}</h2><div className="total-row"><span>{t('cart.subtotal')}</span><span>{currency}{subtotal.toFixed(2)}</span></div><div className="total-row"><span>{t('cart.shipping')}</span><span>{currency}{subtotal ? delivery_fee.toFixed(2) : '0.00'}</span></div><div className="total-row"><span>{t('cart.total')}</span><strong>{currency}{total.toFixed(2)}</strong></div></section>;
};

export default CartTotal;
