import { business } from '../config/business';
import { useI18n } from '../i18n/I18nProvider';
import { Icon } from './Icon';
import { Logo } from './Logo';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="fry-crown fry-crown--footer" aria-hidden="true" />
      <div className="wood-band" aria-hidden="true" />
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo height={48} />
          <p className="muted">{t('brand.tagline')}</p>
        </div>
        <a className="footer__social" href={business.instagramUrl} target="_blank" rel="noopener noreferrer">
          <Icon name="instagram" />
          <span>
            <small>{t('footer.followUs')}</small>
            <bdi dir="ltr">{business.instagramHandle}</bdi>
          </span>
        </a>
      </div>
      <div className="container footer__legal">
        <span>{t('footer.rights', { year: new Date().getFullYear() })}</span>
        {business.showPrototypeNotice && <span>{t('footer.prototype')}</span>}
      </div>
    </footer>
  );
}
