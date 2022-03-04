import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Routes
import routes from './routes.js';

// Cmps
import { AppHeader } from './cmps/AppHeader';
import { UserMsg } from './cmps/UserMsg';

export function RootCmp() {

  return (
    <div className='root-cmp'>
      <AppHeader />
      <main>
        <Routes>
          {routes.map(route => (
            <Route key={route.path} element={route.component} path={route.path} />
          ))}
        </Routes>
      </main>
      <UserMsg />
    </div >
  );
}

export default RootCmp;
