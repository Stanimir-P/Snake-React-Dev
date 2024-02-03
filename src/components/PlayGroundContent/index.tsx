import { useState } from 'react';
import { settings } from '../../utils/settings';
import { Canvas } from './Canvas';

interface IPlayGroundContentProps {
    score: number,
    setScore: React.Dispatch<React.SetStateAction<number>>
}

export const PlayGroundContent: React.FunctionComponent<IPlayGroundContentProps> = props => {
    const { score, setScore } = props;

    const [snake, setSnake] = useState<number[][]>(settings.initialSnake);
    const [rat, setRat] = useState<number[]>(settings.initialRat);
    const [snakeDirection, setSnakeDirection] = useState<number[]>([0, -1]);
    const [delay, setDelay] = useState<number | null>(null);
    const [isPause, setIsPause] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [win, setWin] = useState<boolean>(false);
    const [newGame, setNewGame] = useState<boolean>(true);

    function play() {

        if (!gameOver && !win && !newGame) {

            if (isPause) {
                setIsPause(false);
                setDelay(settings.maxTimeDelay);
                return;
            }

            setIsPause(true);
            setDelay(null);
            return;
        }

        setSnake(settings.initialSnake);
        setRat(settings.initialRat);
        setSnakeDirection([1, 0]);
        setDelay(settings.maxTimeDelay);
        setIsPause(false);
        setGameOver(false);
        setWin(false);
        setNewGame(false);
        setScore(0);
    }

    function changeDirection(e: React.KeyboardEvent<HTMLDivElement>) {
        if (isPause) { return; }

        const is180degrees: boolean =
            (e.key === 'ArrowLeft' && JSON.stringify(snakeDirection) === JSON.stringify([1, 0])) ||
            (e.key === 'ArrowUp' && JSON.stringify(snakeDirection) === JSON.stringify([0, 1])) ||
            (e.key === 'ArrowRight' && JSON.stringify(snakeDirection) === JSON.stringify([-1, 0])) ||
            (e.key === 'ArrowDown' && JSON.stringify(snakeDirection) === JSON.stringify([0, -1]));

        if (is180degrees) { return; }

        switch (e.key) {
            case 'ArrowLeft':
                setSnakeDirection([-1, 0]);
                break;

            case 'ArrowUp':
                setSnakeDirection([0, -1]);
                break;

            case 'ArrowRight':
                setSnakeDirection([1, 0]);
                break;

            case 'ArrowDown':
                setSnakeDirection([0, 1]);
                break;
        };
    };

    return (
        <div className='playGroundContent' onKeyDown={(e) => changeDirection(e)}>

            <h1 className='title'>
                Snake game
            </h1>

            {/* Switch to better state management system (e.g. React Context, Redux...) */}
            <Canvas
                delay={delay}
                snake={snake}
                rat={rat}
                snakeDirection={snakeDirection}
                isPause={isPause}
                gameOver={gameOver}
                win={win}
                score={score}
                setDelay={setDelay}
                setSnake={setSnake}
                setRat={setRat}
                setGameOver={setGameOver}
                setWin={setWin}
                setScore={setScore}
                setNewGame={setNewGame}
            />

            <div className='playButtonContainer'>
                <button onClick={play} className='playButton'>{(newGame || isPause) ? 'Play' : 'Pause'}</button>
            </div>
        </div>
    )
}