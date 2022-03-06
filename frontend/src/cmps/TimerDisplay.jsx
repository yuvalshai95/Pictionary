import React from 'react'

function getFormattedTime(t) {
    return t < 10 ? `0${t}` : t
}

export const TimerDisplay = ({ seconds }) => {
    return (
        <h5 className='timer-display'>Time left: {getFormattedTime(seconds)}</h5>
    )
}

