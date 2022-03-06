import React from 'react'

function getFormattedTime(t) {
    return t < 10 ? `0${t}` : t
}

export const TimerDisplay = ({ seconds }) => {
    return (
        <>
            {
                !seconds ? <h5 className='timer-display'>Time left: N/A </h5>
                    : <h5 className='timer-display'>Time left: {`${getFormattedTime(seconds)}s`}</h5>
            }

        </>
    )
}

