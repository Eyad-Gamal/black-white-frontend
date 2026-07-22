import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { assets } from '../assets/assets';

const Footer = () => {
  const { t } = useTranslation();
  return <footer className="site-footer">
    <div className="page-container footer-grid">
      <section><img className="footer-logo" src={assets.logo} alt="Black and White" /><p className="footer-text">{t('footer.description')}</p></section>
      <section><h2 className="footer-title">{t('footer.company')}</h2><div className="footer-links"><Link to="/">{t('footer.home')}</Link><Link to="/about">{t('footer.about')}</Link><span>{t('footer.delivery')}</span><span>{t('footer.privacyPolicy')}</span></div></section>
      <section><h2 className="footer-title">{t('footer.getInTouch')}</h2><div className="footer-links"><a href={`tel:${t('footer.phone')}`}>{t('footer.phone')}</a><a href={`mailto:${t('footer.contactEmail')}`}>{t('footer.contactEmail')}</a><Link to="/contact">{t('nav.contact')}</Link></div></section>
    </div>
    <div className="footer-bottom">{t('footer.copyright')}</div>
  </footer>;
};

export default Footer;
