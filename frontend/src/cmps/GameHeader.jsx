import { TimerDisplay } from "./TimerDisplay"

export const GameHeader = ({ seconds, isDrawer, word, isGuessedWord }) => {
    return (
        <div className="game-header flex justify-around">
            <TimerDisplay seconds={seconds} />
            {
                !word ? <h5>Waiting for other players...</h5>
                    : (
                        isDrawer ? <h5>Your word to draw is <b>{word}</b> </h5>
                            : <h5>
                                {
                                    isGuessedWord ? `You have guessed the word!`
                                        : word.split('').map(() => (`_ `))

                                }
                            </h5>
                    )
            }
            <h5>Round: 1/3</h5>
        </div>
    )
}




