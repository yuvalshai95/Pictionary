import React from 'react';
import { Routes, Route } from 'react-router-dom';


// Cmps
import { HomePage } from './pages/HomePage'
import { AppHeader } from './cmps/AppHeader';
import { UserMsg } from './cmps/UserMsg';

export function RootCmp() {

  return (
    <div className='root-cmp'>
      <AppHeader />
      <main>
        <Routes>
          <Route path='/' element={<HomePage />} />

        </Routes>
      </main>
      <UserMsg />
    </div>
  );
}
export default RootCmp;
