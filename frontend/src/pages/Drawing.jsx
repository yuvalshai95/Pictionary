import React, { useEffect, useState } from 'react'

// Cmps
import { PlayerList } from '../cmps/PlayerList'
import { CanvasCmp } from '../cmps/CanvasCmp';
import { Chat } from '../cmps/Chat';

// Services
import { socketService } from '../services/socket.service';

export const Drawing = () => {

  const [isDrawer, setIsDrawer] = useState(false)

  useEffect(() => {
    // For now enable drawing if there are more than one
    socketService.on('startGame', () => setIsDrawer(true))
    socketService.on('endGame', () => setIsDrawer(false))
  }, [])

  return (
    <section className="drawing">
      <h1>Drawing page</h1>
      <h1>Drawing page</h1>
      <CanvasCmp isDrawer={isDrawer} />
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
