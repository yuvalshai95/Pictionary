import React from 'react'

export const Leaderboard = ({ id, leaderboardPlayers }) => {
    return (
        <div className="leaderboard-screen-overlay">
            <div className="leaderboard flex column">
                <div className="title">
                    <h1>Leaderboard</h1>
                </div>
                <div className="body leaderboard-players">
                    <ul className="clean-list flex column">
                        {
                            leaderboardPlayers.map(player => (
                                <li className="flex justify-space-between" key={player.id}>
                                    {
                                        id === player.id ? <b>{player.userName}(You)</b>
                                            : <span>{player.userName}</span>
                                    }
                                    <span>{player.score}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="footer">
                    <p>Game will restart in 15s...</p>
                </div>
            </div>
        </div>
    )
}


