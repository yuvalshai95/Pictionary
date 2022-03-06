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
  const [word, setWord] = useState('')
  const [timer, setTimer] = useState(0)
  const [isGuessedWord, setIsGuessedWord] = useState(false)

  useEffect(() => {
    socketService.on('startGame', handleTurn)
    socketService.on('nextTurn', handleTurn)
    socketService.on('tick', setTimer)
    socketService.on('endGame', handleEndGame)
    socketService.on('correctGuess', handleCorrectGuess)
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

  const handleTurn = ({ id, word }) => {
    id === socketService.getSocketId() ?
      setIsDrawer(true) : setIsDrawer(false)

    setWord(word)
    setIsGuessedWord(false)
  }

  const handleEndGame = () => {
    setIsDrawer(false)
    setWord('')
    setTimer(0)
    setIsGuessedWord(false)
  }

  const handleCorrectGuess = () => {
    setIsGuessedWord(true)
  }

  return (
    <section className="drawing">
      <h1>Drawing page</h1>
      <h1>Drawing page</h1>
      <GameHeader
        seconds={timer}
        isDrawer={isDrawer}
        word={word}
        isGuessedWord={isGuessedWord}
      />
      <CanvasCmp isDrawer={isDrawer} />
      <div>
        <h1>Players List</h1>
        <PlayerList />
      </div>
      <div>
        <Chat isDrawer={isDrawer} />
      </div>
    </section>
  );
}
