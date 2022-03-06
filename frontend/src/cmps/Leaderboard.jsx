// Cmps
import { LeaderboardPreview } from '../cmps/LeaderboardPreview'

export const Leaderboard = ({ id, leaderboardPlayers }) => {
    return (
        <div className="leaderboard-screen-overlay">
            <div className="leaderboard flex column">
                <div className="title">
                    <h1>Leaderboard</h1>
                </div>
                <div className="body">
                    <ul className="leaderboard-list clean-list flex column">
                        {
                            leaderboardPlayers.map((player, index) => (
                                <LeaderboardPreview
                                    key={player.id}
                                    index={index + 1}
                                    userName={player.userName}
                                    score={player.score}
                                />
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


