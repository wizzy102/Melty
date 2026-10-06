import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { I18nProvider } from './i18n/I18nProvider';
import { MenuProvider } from './store/menu';
import { CartProvider } from './store/cart';
import { CheckoutProvider } from './store/checkout';
import { ToastProvider } from './components/ui/Toast';
import { Spinner } from './components/ui/States';
import { AppLayout } from './components/AppLayout';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { ProductPage } from './pages/ProductPage';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Review } from './pages/Review';
import { OrderConfirmed } from './pages/OrderConfirmed';
import { NotFound } from './pages/StatusPages';
import { UiKit } from './pages/UiKit';
import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/shop.css';
import './styles/checkout.css';

const AdminApp = lazy(() => import('./admin/AdminApp'));

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
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="checkout/review" element={<Review />} />
                    <Route path="order/confirmed" element={<OrderConfirmed />} />
                    {/* Internal design review page (not linked) */}
                    <Route path="ui" element={<UiKit />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                  {/* Staff area — not linked from the customer site */}
                  <Route
                    path="admin/*"
                    element={
                      <Suspense
                        fallback={
                          <div className="admin-center">
                            <Spinner size={34} />
                          </div>
                        }
                      >
                        <AdminApp />
                      </Suspense>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </CheckoutProvider>
        </CartProvider>
      </MenuProvider>
    </I18nProvider>
  );
}
