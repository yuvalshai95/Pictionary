import { useState, useEffect } from 'react'

// Services
import { socketService } from '../services/socket.service'

export const PlayerList = () => {
    const [players, setPlayers] = useState([])

    useEffect(() => {
        // Player join/leave socket to update player list 
        socketService.off('player')
        socketService.on('player', (newPlayers) => {
            setPlayers(newPlayers)
        })
    }, [])


    return (
        <div className="player-list">
            <ul className="clean-list flex column">
                {players.map(player => (
                    <li key={player.id}>
                        <p>{player.userName}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
