import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const NewsletterBox = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const submit = (event) => { event.preventDefault(); toast.success(t('home.newsletterTitle')); setEmail(''); };
  return <section className="section"><div className="premium-card" style={{ padding: 'clamp(26px, 5vw, 58px)', textAlign: 'center' }}><span className="eyebrow">Black & White</span><h2 style={{ margin: '0', fontSize: 'clamp(1.7rem, 3vw, 2.7rem)' }}>{t('home.newsletterTitle')}</h2><p className="muted" style={{ maxWidth: '560px', margin: '12px auto 23px' }}>{t('home.newsletterText')}</p><form onSubmit={submit} style={{ display: 'flex', maxWidth: '510px', margin: 'auto', gap: '9px' }}><input className="glass-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t('home.newsletterPlaceholder')} required /><button className="premium-button" type="submit">{t('home.newsletterButton')}</button></form></div></section>;
};

export default NewsletterBox;
