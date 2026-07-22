import { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import MobileMenu from './MobileMenu';

const navItems = [
  ['/', 'nav.home'],
  ['/collection', 'nav.collection'],
  ['/about', 'nav.about'],
  ['/contact', 'nav.contact'],
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    setProfileOpen(false);
    navigate('/');
  };
  const count = getCartCount();

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <Link className="header-logo" to="/" aria-label="Black and White home"><img src={assets.logo} alt="Black and White" /></Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map(([path, label]) => <NavLink key={path} className="nav-link" to={path} end={path === '/'}>{t(label)}</NavLink>)}
          </nav>
          <div className="header-actions">
            <button className="icon-button" onClick={() => setShowSearch(true)} aria-label={t('common.search')}><span aria-hidden="true">⌕</span></button>
            <button className="icon-button language-button" onClick={toggleLanguage} aria-label={t('nav.language')}>{i18n.language === 'ar' ? 'EN' : 'ع'}</button>
            <div className="profile-menu">
              <button className="icon-button" onClick={() => token ? setProfileOpen((open) => !open) : navigate('/login')} aria-label={t('nav.profile')}><span aria-hidden="true">◉</span></button>
              {token && profileOpen && <div className="profile-dropdown end">
                <button onClick={() => { setProfileOpen(false); navigate('/orders'); }}>{t('nav.orders')}</button>
                <button onClick={logout}>{t('nav.logout')}</button>
              </div>}
            </div>
            <Link className="icon-button cart-link" to="/cart" aria-label={t('cart.title')}><span aria-hidden="true">⌑</span>{count > 0 && <span className="cart-count">{count}</span>}</Link>
            <button className="icon-button mobile-trigger" onClick={() => setMenuOpen(true)} aria-label={t('nav.menu')}><span aria-hidden="true">☰</span></button>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;
