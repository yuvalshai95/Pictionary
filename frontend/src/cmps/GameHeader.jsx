import { TimerDisplay } from "./TimerDisplay"

export const GameHeader = ({ seconds }) => {
    return (
        <div className="game-header flex justify-around">
            <TimerDisplay seconds={seconds} />
            <h5>Your word is LoremIpsum</h5>
            <h5>Round: 0</h5>
        </div>
    )
}




