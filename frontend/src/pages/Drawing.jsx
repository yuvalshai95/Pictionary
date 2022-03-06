import React, { useEffect, useState } from 'react'

// Cmps
import { PlayerList } from '../cmps/PlayerList'
import { CanvasCmp } from '../cmps/CanvasCmp';
import { Chat } from '../cmps/Chat';
import { GameHeader } from '../cmps/GameHeader';


// Services
import { socketService } from '../services/socket.service';

export const Drawing = () => {
  // const { seconds, start: startTimer } = useTimer({
  //   onEnd: () => nextTurn()
  // })
  const [isDrawer, setIsDrawer] = useState(false)
  const [drawer, setDrawer] = useState(null)
  const [timer, setTimer] = useState(0)
  // const [isGameRunning, setIsGameRunning] = useState(false)

  useEffect(() => {
    socketService.on('startGame', handleTurn)
    socketService.on('nextTurn', handleTurn)
    socketService.on('tick', setTimer)
    socketService.on('endGame', handleEndGame)
    // For now enable drawing if there are more than one
    // socketService.on('startGame', () => setIsDrawer(true))
    // socketService.on('nextTurn', (drawer) => {
    //   drawer.id === socketService.getSocketId() ? setIsDrawer(true) : setIsDrawer(false)
    //   startTimer(10)
    //   setDrawerName(drawer.userName)
    //   setIsGameRunning(true)
    // })
    // socketService.on('endGame', () => {
    //   setIsDrawer(false)
    //   setIsGameRunning(false)
    // })
  }, [])

  const handleTurn = (drawer) => {
    drawer.id === socketService.getSocketId() ?
      setIsDrawer(true) : setIsDrawer(false)
    setDrawer(drawer)
  }

  const handleEndGame = () => {
    setIsDrawer(false)
    setDrawer(null)
    setTimer(0)
  }

  return (
    <section className="drawing">
      <h1>Drawing page</h1>
      <h1>Drawing page</h1>
      <GameHeader
        seconds={timer}
        // isGameRunning={isGameRunning}
        // drawerName={drawerName}
        isDrawer={isDrawer}
        drawer={drawer}
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
