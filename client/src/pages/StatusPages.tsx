import { useI18n } from '../i18n/I18nProvider';
import { ButtonLink } from '../components/ui/Button';
import { StateMessage } from '../components/ui/States';
import { ProductArt } from '../components/ProductArt';

/** TEMPORARY: stands in for screens built in the next phase. */
export function ComingSoon() {
  const { t } = useI18n();
  return (
    <section className="container section page-enter">
      <StateMessage
        art={
          <div className="state__art">
            <ProductArt art="waffle" seed="soon" />
          </div>
        }
        title={t('state.soon.title')}
        body={t('state.soon.body')}
        action={<ButtonLink to="/">{t('state.notFound.cta')}</ButtonLink>}
      />
    </section>
  );
}

export function NotFound() {
  const { t } = useI18n();
  return (
    <section className="container section page-enter">
      <StateMessage
        icon="alert"
        title={t('state.notFound.title')}
        body={t('state.notFound.body')}
        action={<ButtonLink to="/">{t('state.notFound.cta')}</ButtonLink>}
      />
    </section>
  );
}
