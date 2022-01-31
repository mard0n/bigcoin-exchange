import React, { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useStore from '../../state';

interface ProtectedRouteProps {}

const ProtectedRoute: FC<ProtectedRouteProps> = () => {
  const isAuth = useStore((state: any) => state.isAuth);
  const { pathname } = useLocation();

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ lastLocation: pathname }} />
  );
};

export default ProtectedRoute;
