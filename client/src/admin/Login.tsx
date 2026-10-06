import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router';
import { ApiError } from '../api/client';
import { useI18n } from '../i18n/I18nProvider';
import { Icon } from '../components/Icon';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/Field';
import { InlineAlert, Spinner } from '../components/ui/States';
import { useAdminAuth, type LoginRedirectState } from './AdminAuth';

export function Login() {
  const { t, errorText, toggleLang } = useI18n();
  const { state, login } = useAdminAuth();
  const redirect = (useLocation().state as LoginRedirectState | null) ?? {};

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (state.status === 'in') {
    const target = redirect.from?.startsWith('/admin') && !redirect.from.startsWith('/admin/login') ? redirect.from : '/admin';
    return <Navigate to={target} replace />;
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!username.trim() || !password) {
      setError(t('admin.login.required'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(errorText(err instanceof ApiError ? err.code : 'server_error'));
      setPassword('');
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <button type="button" className="lang-toggle admin-login__lang" onClick={toggleLang} aria-label={t('lang.switchLabel')}>
        <Icon name="globe" size={18} />
        <span>{t('lang.switch')}</span>
      </button>

      <div className="admin-login__card">
        <div className="admin-login__brand">
          <Logo height={52} glow />
          <span className="admin-header__tag">{t('admin.badge')}</span>
        </div>
        <div>
          <h1 className="admin-login__title">{t('admin.login.title')}</h1>
          <p className="panel__sub">{t('admin.login.sub')}</p>
        </div>

        {state.status === 'checking' ? (
          <div className="admin-center admin-center--inline">
            <Spinner size={28} label={t('common.loading')} />
          </div>
        ) : (
          <form className="admin-login__form" onSubmit={submit} noValidate>
            {redirect.reason === 'expired' && !error && <InlineAlert tone="info">{t('admin.login.expired')}</InlineAlert>}
            {redirect.reason === 'logout' && !error && <InlineAlert tone="success">{t('admin.loggedOut')}</InlineAlert>}
            {error && <InlineAlert>{error}</InlineAlert>}

            <TextField
              label={t('admin.login.username')}
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              dir="ltr"
              maxLength={100}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <div className="password-field">
              <TextField
                label={t('admin.login.password')}
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                dir="ltr"
                maxLength={200}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="text-btn password-field__toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
              >
                {showPassword ? t('admin.login.hide') : t('admin.login.show')}
              </button>
            </div>

            <Button type="submit" size="lg" block loading={busy} icon={<Icon name="lock" size={18} />}>
              {t('admin.login.submit')}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
