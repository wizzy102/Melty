import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { CartBar } from './CartBar';
import { Footer } from './Footer';
import { Header } from './Header';

/** Public customer shell. The admin area uses its own layout. */
export function AppLayout() {
  const { pathname, hash } = useLocation();

  // New page → start at the top (unless jumping to an anchor like /menu#crepes).
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <Outlet />
      </main>
      <Footer />
      <CartBar />
    </div>
  );
}
