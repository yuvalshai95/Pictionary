import React, { useEffect, useState } from 'react'

// Cmps
import { PlayerList } from '../cmps/PlayerList'
import { CanvasCmp } from '../cmps/CanvasCmp';
import { Chat } from '../cmps/Chat';
import { GameHeader } from '../cmps/GameHeader';
import { useTimer } from '../services/useTimer'

// Services
import { socketService } from '../services/socket.service';

export const Drawing = () => {
  const { seconds, start: startTimer } = useTimer({
    onEnd: () => nextTurn()
  })
  const [isDrawer, setIsDrawer] = useState(false)

  useEffect(() => {
    // For now enable drawing if there are more than one
    // socketService.on('startGame', () => setIsDrawer(true))
    socketService.on('nextTurn', (id) => {
      id === socketService.getSocketId() ? setIsDrawer(true) : setIsDrawer(false)
      startTimer(10)
    })
    socketService.on('endGame', () => setIsDrawer(false))
  }, [])

  const nextTurn = () => {
    isDrawer && socketService.emit('nextTurn')
  }

  return (
    <section className="drawing">
      <h1>Drawing page</h1>
      <h1>Drawing page</h1>
      <GameHeader seconds={seconds} />
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
