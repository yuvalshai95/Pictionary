import { useEffect, useState } from 'react';
import { showUserMsg } from '../services/event-bus.service.js'
export const HomePage = () => {

  return (
    <section className="home-page">
      <h1>Home</h1>
      <button onClick={() => {
        showUserMsg('hi')
      }}>user msg</button>
    </section>
  );
}

