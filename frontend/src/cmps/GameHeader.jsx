import { TimerDisplay } from "./TimerDisplay"

export const GameHeader = ({ seconds, drawerName, isDrawer, isGameRunning }) => {
    return (
        <div className="game-header flex justify-around">
            <TimerDisplay seconds={seconds} />
            {
                isGameRunning ? (
                    <h5>
                        {
                            isDrawer ? 'You are drawing'
                                : `${drawerName} is drawing`
                        }
                    </h5>
                ) : <h5>Waiting for other players...</h5>
            }
            <h5>Round: 0</h5>
        </div>
    )
}




