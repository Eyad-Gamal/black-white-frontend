import { useTranslation } from 'react-i18next';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const About = () => {
  const { t } = useTranslation();
  const pillars = [['about.quality', 'about.qualityText'], ['about.ease', 'about.easeText'], ['about.service', 'about.serviceText']];
  return <main className="page-container page-content"><section className="info-hero"><img src={assets.about_img} alt="Black and White collection" loading="lazy" /><div className="info-copy"><span className="eyebrow">{t('about.eyebrow')}</span><h1>{t('about.title')}</h1><p>{t('about.intro')}</p><h2>{t('about.missionTitle')}</h2><p>{t('about.mission')}</p></div></section><section className="pillars">{pillars.map(([title, text]) => <article className="pillar premium-card" key={title}><strong>{t(title)}</strong><p>{t(text)}</p></article>)}</section><NewsletterBox /></main>;
};

export default About;
