import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoutes = ({ element: Element, allowedRoles, user, children }) => {
  if (!user) {
    // User is not logged in, redirect to login page
    return <Navigate to="/" />;
  }

  // Check if user's role is allowed for the route
  if (!allowedRoles.includes(user.role)) {
    console.log(user)
    // User's role is not allowed, redirect to login page
    return <Navigate to="/" />;
  }
  console.log(user.FirstName + ' ' + user.LastName +  ' as ' +user.role)
  

//   return <Route {...rest} element={<Element />} />;
return children
};

export default PrivateRoutes;