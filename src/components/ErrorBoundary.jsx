import React from 'react';
import { useTranslation } from 'react-i18next';

class Boundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <Fallback />;
    return this.props.children;
  }
}

function Fallback() {
  const { t } = useTranslation();
  return (
    <main className="page-container page-content">
      <section className="premium-card empty-state">
        <span className="eyebrow">Black & White</span>
        <h1 className="page-heading">{t('common.error')}</h1>
        <button className="premium-button" onClick={() => window.location.assign('/')}>{t('common.back')}</button>
      </section>
    </main>
  );
}

export default Boundary;
