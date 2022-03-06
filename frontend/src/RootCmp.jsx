import React from 'react';
import { Routes, Route } from 'react-router-dom';


// Cmps
import { Welcome } from './pages/Welcome'
import { Drawing } from './pages/Drawing'
import { UserMsg } from './cmps/UserMsg';

export function RootCmp() {

  return (
    <div className='root-cmp'>
      <main>
        <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/drawing' element={<Drawing />} />

        </Routes>
      </main>
      <UserMsg />
    </div>
  );
}
export default RootCmp;
