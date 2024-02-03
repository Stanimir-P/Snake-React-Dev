interface IScoreBox {
    score: number
}

export const ScoreBox: React.FunctionComponent<IScoreBox> = props => {
    const highScore = localStorage.getItem('snakeScore');

    return (
        <div className='scoreBoxContainer'>

            <div className='scoreBox'>
                <div className='score'>Score:{props.score}</div>

                <div className='highScore'>High Score:{highScore ? highScore : 0}</div>
            </div>
        </div>
    )
}