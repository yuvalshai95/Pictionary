// import React from 'react'

export const LeaderboardPreview = ({ index, userName, score }) => {

    const getIcon = (index) => {
        if (index === 1) return '🥇'
        if (index === 2) return '🥈'
        if (index === 3) return '🥉'
        return ''
    }

    return (
        <div className="leaderboard-preview flex justify-space-between">
            <p>{getIcon(index)} <b>#{index}</b> {userName} </p>
            <p>{score}</p>
        </div>
    )
}

