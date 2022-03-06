import { TimerDisplay } from "./TimerDisplay"

export const GameHeader = ({ seconds, isDrawer, word, isGuessedWord, round }) => {
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
            {
                round ? <h5>Round: {round}/3</h5>
                    : <h5>Round: N/A </h5>
            }
        </div>
    )
}




