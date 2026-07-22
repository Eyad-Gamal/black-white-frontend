import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { assets } from '../assets/assets';

const Hero = ({ overlayType = 'gradient' }) => {
  const { t } = useTranslation();
  return <section className={`hero hero-${overlayType}`}>
    <div className="hero-grid">
      <div className="hero-copy"><span className="eyebrow">{t('hero.eyebrow')}</span><h1 className="hero-title">{t('hero.titleStart')} <span>{t('hero.titleEnd')}</span></h1><p className="hero-subtitle">{t('hero.subtitle')}</p><div className="hero-actions"><Link className="premium-button" to="/collection">{t('hero.cta')}</Link><Link className="premium-button-outline" to="/about">{t('hero.secondaryCta')}</Link></div></div>
      <div className="hero-visual"><div className="hero-image-wrap"><img src={assets.hero_img} alt="Premium fashion collection" fetchPriority="high" /></div><div className="hero-note"><strong>{t('hero.noteTitle')}</strong>{t('hero.note')}</div></div>
    </div>
  </section>;
};

export default Hero;
