import React from 'react';
import {useSelector} from 'react-redux';
import {Navigate, Outlet} from 'react-router-dom';

export const PrivatedRoutes = (props: any) => {
  const authState = useSelector((state: {auth: any}) => state.auth);
  return authState.isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};
