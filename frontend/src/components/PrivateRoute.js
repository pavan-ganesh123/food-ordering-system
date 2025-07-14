import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuth = !!localStorage.getItem('adminToken');
  return (
    <Route
      {...rest}
      render={props =>
        isAuth
          ? <Component {...props} />
          : <Redirect to="/admin/login" />
      }
    />
  );
};

export default PrivateRoute;
