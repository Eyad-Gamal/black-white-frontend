import { useTranslation } from 'react-i18next';

const AnnouncementBar = () => {
  const { t } = useTranslation();
  const message = t('announcement');
  return (
    <aside className="announcement-bar" aria-label={message}>
      <div className="announcement-track">
        {Array.from({ length: 8 }, (_, index) => <span className="announcement-item" key={index}>{message}</span>)}
      </div>
    </aside>
  );
};

export default AnnouncementBar;
