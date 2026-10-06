import { Navigate, Route, Routes } from 'react-router';
import { AdminAuthProvider, RequireAdmin } from './AdminAuth';
import { AdminLayout } from './AdminLayout';
import { Login } from './Login';
import { Orders } from './Orders';
import { OrderDetail } from './OrderDetail';
import { Products } from './Products';
import '../styles/admin.css';

/** Everything under /admin. Loaded as a separate bundle, so customers never download it. */
export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="products" element={<Products />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminAuthProvider>
  );
}
