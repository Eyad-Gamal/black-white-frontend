import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ClientCache from '../utils/clientCache';

export const ShopContext = createContext();
const PRODUCT_CACHE_KEY = 'black-white:products';
const PRODUCT_CACHE_TTL = 15 * 60 * 1000;
const productCache = new ClientCache();

const ShopContextProvider = ({ children }) => {
  const currency = '$';
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const navigate = useNavigate();

  const invalidateProductCache = useCallback(() => productCache.remove(PRODUCT_CACHE_KEY), []);
  const getProductData = useCallback(async ({ force = false } = {}) => {
    if (!force) {
      const cachedProducts = productCache.get(PRODUCT_CACHE_KEY);
      if (cachedProducts) {
        setProducts(cachedProducts);
        setIsProductsLoading(false);
        return cachedProducts;
      }
    }
    setIsProductsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        const nextProducts = response.data.products || [];
        productCache.set(PRODUCT_CACHE_KEY, nextProducts, PRODUCT_CACHE_TTL);
        setProducts(nextProducts);
        return nextProducts;
      }
      toast.error(response.data.message || 'Unable to load products');
      return [];
    } catch (error) {
      console.error(error);
      toast.error('Unable to load products. Please try again.');
      return [];
    } finally {
      setIsProductsLoading(false);
    }
  }, [backendUrl]);

  const getUserCart = useCallback(async (activeToken) => {
    if (!activeToken) return;
    try {
      const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token: activeToken } });
      if (response.data.success) setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error(error);
    }
  }, [backendUrl]);

  useEffect(() => { getProductData(); }, [getProductData]);
  useEffect(() => { getUserCart(token); }, [getUserCart, token]);

  const addToCart = async (itemId, size) => {
    if (!size) { toast.error('Please select a size'); return false; }
    const cartData = structuredClone(cartItems);
    cartData[itemId] = cartData[itemId] || {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    setCartItems(cartData);
    invalidateProductCache();
    if (!token) return true;
    try {
      const response = await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
      if (!response.data.success) throw new Error(response.data.message);
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Unable to update your cart');
      await getUserCart(token);
      return false;
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);
    if (!cartData[itemId]) return;
    cartData[itemId][size] = Number(quantity) || 0;
    setCartItems(cartData);
    if (!token) return;
    try {
      await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity: Number(quantity) || 0 }, { headers: { token } });
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Unable to update your cart');
      await getUserCart(token);
    }
  };

  const getCartCount = () => Object.values(cartItems).reduce((total, sizes) => total + Object.values(sizes || {}).reduce((sum, quantity) => sum + (Number(quantity) || 0), 0), 0);
  const getCartAmount = () => Object.entries(cartItems).reduce((total, [productId, sizes]) => {
    const product = products.find((item) => item._id === productId);
    if (!product) return total;
    return total + Object.entries(sizes || {}).reduce((sum, [size, quantity]) => sum + ((product.prices?.[size] ?? product.price ?? 0) * (Number(quantity) || 0)), 0);
  }, 0);

  const value = useMemo(() => ({
    products, isProductsLoading, currency, delivery_fee, search, setSearch, showSearch, setShowSearch,
    cartItems, setCartItems, addToCart, getCartCount, updateQuantity, getCartAmount, navigate, backendUrl,
    setToken, token, getProductData, invalidateProductCache,
  }), [products, isProductsLoading, search, showSearch, cartItems, token, backendUrl, navigate]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
