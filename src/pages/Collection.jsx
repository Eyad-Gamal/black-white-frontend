import { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShopContext } from '../context/ShopContext';
import SkeletonLoader from '../components/SkeletonLoader';
import ProductItem from '../components/ProductItem';
import ProductModal from '../components/ProductModal';

const categories = ['Men', 'Women', 'Kids'];
const types = ['Topwear', 'Bottomwear', 'Winterwear'];

const Collection = () => {
  const { products, isProductsLoading, search, showSearch } = useContext(ShopContext);
  const { t, i18n } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sort, setSort] = useState('relevant');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toggle = (value, setValues) => setValues((values) => values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const items = products.filter((product) => {
      const productTitle = typeof product.name === 'object' ? (product.name[i18n.language] || product.name.ar || product.name.en) : product.name;
      return (!showSearch || !query || productTitle?.toLocaleLowerCase().includes(query)) && (!selectedCategories.length || selectedCategories.includes(product.category)) && (!selectedTypes.length || selectedTypes.includes(product.subCategory));
    });
    if (sort === 'low-high') return [...items].sort((a, b) => a.price - b.price);
    if (sort === 'high-low') return [...items].sort((a, b) => b.price - a.price);
    return items;
  }, [products, search, showSearch, selectedCategories, selectedTypes, sort, i18n.language]);

  const checkboxGroup = (title, items, selected, setSelected) => <div className="filter-group"><strong className="filter-title">{title}</strong>{items.map((item) => <label className="filter-label" key={item}><input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(item, setSelected)} />{item}</label>)}</div>;
  return <main className="page-container page-content">
    <span className="eyebrow">{t('collection.eyebrow')}</span><h1 className="page-heading">{t('collection.title')}</h1>
    <div className="collection-layout">
      <aside className="filters premium-card"><button className="premium-button-outline filter-toggle" onClick={() => setShowFilters((show) => !show)}>{t('collection.filters')}</button><div className={`filters-content ${showFilters ? '' : 'collapsed'}`}>{checkboxGroup(t('collection.categories'), categories, selectedCategories, setSelectedCategories)}{checkboxGroup(t('collection.types'), types, selectedTypes, setSelectedTypes)}</div></aside>
      <section><div className="collection-toolbar"><span className="muted">{isProductsLoading ? t('common.loading') : `${filteredProducts.length} ${t('search.results')}`}</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label={t('collection.sort')}><option value="relevant">{t('collection.relevant')}</option><option value="low-high">{t('collection.lowHigh')}</option><option value="high-low">{t('collection.highLow')}</option></select></div>{isProductsLoading ? <SkeletonLoader /> : filteredProducts.length ? <div className="products-grid">{filteredProducts.map((product, index) => <ProductItem key={product._id} product={product} index={index} onQuickView={setSelectedProduct} />)}</div> : <div className="premium-card empty-state"><p>{t('collection.noProducts')}</p></div>}</section>
    </div>
    <ProductModal product={selectedProduct} isOpen={Boolean(selectedProduct)} onClose={() => setSelectedProduct(null)} />
  </main>;
};

export default Collection;
