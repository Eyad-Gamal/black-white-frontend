import { useContext, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ShopContext } from '../context/ShopContext';
import { productImages, productName, productPrice } from '../utils/productData';

const SearchOverlay = () => {
  const { showSearch, setShowSearch, products, search, setSearch, navigate, currency } = useContext(ShopContext);
  const { t, i18n } = useTranslation();
  const inputRef = useRef(null);
  const query = search.trim();
  const results = useMemo(() => {
    if (!query) return [];
    return products.filter((product) => productName(product, i18n.language).toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  }, [products, query, i18n.language]);

  const close = () => { setShowSearch(false); setSearch(''); };
  useEffect(() => {
    if (!showSearch) return undefined;
    inputRef.current?.focus();
    const onKeyDown = (event) => event.key === 'Escape' && close();
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = ''; };
  }, [showSearch]);

  const highlight = (text) => text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')).map((part, index) => part.toLocaleLowerCase() === query.toLocaleLowerCase() ? <mark className="match" key={index}>{part}</mark> : part);
  if (!showSearch) return null;

  return <div className="search-overlay" onMouseDown={(event) => event.target === event.currentTarget && close()}>
    <div className="search-panel">
      <div className="search-input-wrap">
        <input ref={inputRef} className="glass-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('search.placeholder')} />
        <button className="icon-button" onClick={close} aria-label={t('common.close')}>×</button>
      </div>
      <div className="search-results">
        {!query && <div className="empty-state"><p>{t('search.hint')}</p></div>}
        {query && results.length === 0 && <div className="empty-state"><p>{t('search.noResults')}</p></div>}
        {results.map((product) => <article className="search-result" key={product._id} onClick={() => { navigate(`/product/${product._id}`); close(); }}>
          <img src={productImages(product)[0]} alt={productName(product, i18n.language)} loading="lazy" />
          <div><strong>{highlight(productName(product, i18n.language))}</strong><p className="muted">{product.category}</p></div>
          <strong className="product-price">{currency}{productPrice(product)}</strong>
        </article>)}
      </div>
    </div>
  </div>;
};

export default SearchOverlay;
