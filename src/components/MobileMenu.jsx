import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const links = [
  ['/', 'nav.home'],
  ['/collection', 'nav.collection'],
  ['/about', 'nav.about'],
  ['/contact', 'nav.contact'],
];

const MobileMenu = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const changeLanguage = () => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  return (
    <>
      <div className={`mobile-menu-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`mobile-menu ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <div className="mobile-menu-top"><strong>{t('nav.menu')}</strong><button className="icon-button" onClick={onClose} aria-label={t('common.close')}>×</button></div>
        <nav className="mobile-menu-links">{links.map(([path, label]) => <NavLink key={path} to={path} end={path === '/'} onClick={onClose}>{t(label)}</NavLink>)}</nav>
        <div className="mobile-menu-bottom"><button className="premium-button-outline mobile-language" onClick={changeLanguage}>{t('nav.language')}</button></div>
      </aside>
    </>
  );
};

export default MobileMenu;
