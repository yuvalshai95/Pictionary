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
  const [drawerName, setDrawerName] = useState('')
  const [isGameRunning, setIsGameRunning] = useState(false)

  useEffect(() => {
    // For now enable drawing if there are more than one
    // socketService.on('startGame', () => setIsDrawer(true))
    socketService.on('nextTurn', (drawer) => {
      drawer.id === socketService.getSocketId() ? setIsDrawer(true) : setIsDrawer(false)
      startTimer(10)
      setDrawerName(drawer.userName)
      setIsGameRunning(true)
    })
    socketService.on('endGame', () => {
      setIsDrawer(false)
      setIsGameRunning(false)
    })
  }, [])

  const nextTurn = () => {
    isDrawer && socketService.emit('nextTurn')
  }

  return (
    <section className="drawing">
      <h1>Drawing page</h1>
      <h1>Drawing page</h1>
      <GameHeader
        seconds={seconds}
        isGameRunning={isGameRunning}
        drawerName={drawerName}
        isDrawer={isDrawer}
      />
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
