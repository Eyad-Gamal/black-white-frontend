import { useTranslation } from 'react-i18next';
import { assets } from '../assets/assets';

const Contact = () => {
  const { t } = useTranslation();
  return <main className="page-container page-content"><section className="info-hero"><img src={assets.contact_img} alt="Contact Black and White" loading="lazy" /><div className="info-copy"><span className="eyebrow">{t('contact.eyebrow')}</span><h1>{t('contact.title')}</h1><p>{t('contact.intro')}</p><div className="contact-details"><article className="contact-detail premium-card"><strong>{t('contact.store')}</strong><span>{t('contact.address')}</span></article><article className="contact-detail premium-card"><strong>{t('contact.email')}</strong><a href={`mailto:${t('contact.email')}`}>{t('contact.email')}</a><br /><a href={`tel:${t('contact.phone')}`}>{t('contact.phone')}</a></article><article className="contact-detail premium-card"><strong>{t('contact.careers')}</strong><span>{t('contact.careersText')}</span><button className="text-link" style={{ marginTop: '10px' }}>{t('contact.careersButton')}</button></article></div></div></section></main>;
};

export default Contact;
