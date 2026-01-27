import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('approver_token');
  return token ? children : <Navigate to="/approver-login" />;
};

export default ProtectedRoute;
