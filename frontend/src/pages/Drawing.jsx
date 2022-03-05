// import React from 'react';

// Cmps
import { PlayerList } from '../cmps/PlayerList'
import { CanvasCmp } from '../cmps/CanvasCmp';
import { Chat } from '../cmps/Chat';

export const Drawing = () => {
  return (
    <section className="drawing">
      <h1>Drawing page</h1>
      <h1>Drawing page</h1>
      <CanvasCmp />
      <div>
        <h1>Players List</h1>
        <PlayerList />
      </div>
      <div>
        <Chat />
      </div>
    </section>
  );
}
