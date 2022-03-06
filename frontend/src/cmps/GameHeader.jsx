import { TimerDisplay } from "./TimerDisplay"

export const GameHeader = ({ seconds, isDrawer, drawer }) => {
    return (
        <div className="game-header flex justify-around">
            <TimerDisplay seconds={seconds} />
            {
                !drawer ? <h5>Waiting for other players...</h5>
                    : (
                        isDrawer ? <h5>You are drawing</h5>
                            : <h5>{drawer.userName} is drawing</h5>
                    )
            }
            <h5>Round: 1/3</h5>
        </div>
    )
}




