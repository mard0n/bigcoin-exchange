import React, { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../../state';

interface ProtectedRouteProps {}

const ProtectedRoute: FC<ProtectedRouteProps> = () => {
  const isAuth = useStore((state: any) => state.isAuth);

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
