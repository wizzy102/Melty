import { BrowserRouter, Route, Routes } from 'react-router';
import { I18nProvider } from './i18n/I18nProvider';
import { MenuProvider } from './store/menu';
import { CartProvider } from './store/cart';
import { CheckoutProvider } from './store/checkout';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/AppLayout';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { ProductPage } from './pages/ProductPage';
import { Cart } from './pages/Cart';
import { ComingSoon, NotFound } from './pages/StatusPages';
import { UiKit } from './pages/UiKit';
import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/shop.css';

export function App() {
  return (
    <I18nProvider>
      <MenuProvider>
        <CartProvider>
          <CheckoutProvider>
            <ToastProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="menu" element={<Menu />} />
                    <Route path="product/:slug" element={<ProductPage />} />
                    <Route path="cart" element={<Cart />} />
                    {/* Built in Phase 4 */}
                    <Route path="checkout/*" element={<ComingSoon />} />
                    {/* Internal design review page (not linked) */}
                    <Route path="ui" element={<UiKit />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </CheckoutProvider>
        </CartProvider>
      </MenuProvider>
    </I18nProvider>
  );
}
