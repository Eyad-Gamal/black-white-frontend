import { useTranslation } from 'react-i18next';

const OurPolicy = () => {
  const { t } = useTranslation();
  const policies = [
    ['✦', 'home.policyQuality', 'home.policyQualityText'],
    ['↺', 'home.policyReturns', 'home.policyReturnsText'],
    ['◌', 'home.policySupport', 'home.policySupportText'],
  ];
  return <section className="section"><div className="pillars">{policies.map(([icon, title, text]) => <article className="pillar premium-card" key={title}><span className="eyebrow">{icon}</span><strong>{t(title)}</strong><p>{t(text)}</p></article>)}</div></section>;
};

export default OurPolicy;
