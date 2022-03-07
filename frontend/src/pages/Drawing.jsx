import React, { useEffect, useState } from 'react'


// Cmps
import { PlayerList } from '../cmps/PlayerList'
import { CanvasCmp } from '../cmps/CanvasCmp';
import { Chat } from '../cmps/Chat';
import { GameHeader } from '../cmps/GameHeader';
import { Leaderboard } from '../cmps/Leaderboard'


// Services
import { socketService } from '../services/socket.service';

export const Drawing = () => {
  const [isDrawer, setIsDrawer] = useState(false)
  const [isLeaderBoardShown, setIsLeaderBoardShown] = useState(false)
  const [isGuessedWord, setIsGuessedWord] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [word, setWord] = useState('')
  const [timer, setTimer] = useState(0)
  const [round, setRound] = useState(0)

  useEffect(() => {
    socketService.on('join', handleJoin)
    socketService.on('startGame', handleTurn)
    socketService.on('nextRound', handleNextRound)
    socketService.on('nextTurn', handleTurn)
    socketService.on('tick', setTimer)
    socketService.on('correctGuess', handleCorrectGuess)
    socketService.on('resetGame', handleResetGame)
    socketService.on('leaderboard', handleLeaderboard)

  }, [])

  const handleJoin = ({ word, round }) => {
    setRound(round)
    setWord(word)
  }

  const handleTurn = ({ id, word }) => {
    id === socketService.getSocketId() ?
      setIsDrawer(true) : setIsDrawer(false)

    setIsGuessedWord(false)
    setIsLeaderBoardShown(false)
    setWord(word)
  }

  const handleResetGame = () => {
    setIsGuessedWord(false)
    setIsDrawer(false)
    setTimer(0)
    setRound(0)
    setWord('')
  }

  const handleLeaderboard = (leaderboard) => {
    setLeaderboard(leaderboard)
    setIsLeaderBoardShown(true)
  }

  const handleNextRound = () => {
    setRound((prevRound) => ++prevRound)
  }

  const handleCorrectGuess = () => {
    setIsGuessedWord(true)
  }

  return (
    <section className="drawing flex column align-center">
      {isLeaderBoardShown && <Leaderboard
        id={socketService.getSocketId()}
        leaderboardPlayers={leaderboard}
      />}
      <GameHeader
        seconds={timer}
        isDrawer={isDrawer}
        word={word}
        round={round}
        isGuessedWord={isGuessedWord}
      />
      <div className="drawing-body flex justify-center">
        <PlayerList />
        <CanvasCmp isDrawer={isDrawer} />
        <Chat isDrawer={isDrawer} />
      </div>
    </section>
  );
}
