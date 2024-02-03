import { useEffect, useRef } from 'react';
import Rat from '../../media/rat.png';
import useInterval from '../../useInterval';
import { settings } from '../../utils/settings';

interface ICanvasProps {
    delay: number | null;
    snake: number[][];
    rat: number[];
    snakeDirection: number[];
    isPause: boolean;
    gameOver: boolean;
    win: boolean;
    score: number;
    setDelay: React.Dispatch<React.SetStateAction<number | null>>,
    setSnake: React.Dispatch<React.SetStateAction<number[][]>>,
    setRat: React.Dispatch<React.SetStateAction<number[]>>,
    setGameOver: React.Dispatch<React.SetStateAction<boolean>>,
    setWin: React.Dispatch<React.SetStateAction<boolean>>,
    setScore: React.Dispatch<React.SetStateAction<number>>,
    setNewGame: React.Dispatch<React.SetStateAction<boolean>>
}

export const Canvas: React.FunctionComponent<ICanvasProps> = props => {

    const {
        delay,
        snake,
        rat,
        snakeDirection,
        isPause,
        score,
        setDelay,
        setSnake,
        setRat,
        setGameOver,
        setWin,
        setScore,
        setNewGame
    } = props;

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useInterval(() => runGame(), delay);

    useEffect(() => {

        let ratElement = document.getElementById('rat') as HTMLCanvasElement;

        if (canvasRef.current) {
            const canvas = canvasRef.current;

            const context = canvas.getContext('2d');

            if (context) {
                context.setTransform(settings.scale, 0, 0, settings.scale, 0, 0);

                // erase pixels behind snake while moving
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);

                // snake color
                context.fillStyle = '#a3d001';

                // create snake
                snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));

                // draw rat
                context.drawImage(ratElement, rat[0], rat[1], 1, 1);
            }
        }
    }, [snake, rat, canvasRef]);

    function runGame() {
        if (isPause) { return; }

        calculateDelay(score);

        const newSnake = [...snake];
        const newSnakeHead = [newSnake[0][0] + snakeDirection[0], newSnake[0][1] + snakeDirection[1]];

        newSnake.unshift(newSnakeHead);

        if (score >= settings.totalPoints) {
            setDelay(null);
            setWin(true);
            handleSetScore();
            setNewGame(true);
        }

        if (checkCollision(newSnakeHead)) {
            setDelay(null);
            setGameOver(true);
            handleSetScore();
            setNewGame(true);
        }

        if (!appleAte(newSnake)) {
            newSnake.pop();
        };

        setSnake(newSnake);
    };

    function calculateDelay(score: number | null): void {

        const minDelayScore = ((settings.maxTimeDelay - settings.minTimeDelay) / 10) * 5; // what score min delay is reached

        if (!score || score < 5) {
            setDelay(settings.maxTimeDelay);
            return;
        }

        if (score >= minDelayScore) {
            setDelay(settings.minTimeDelay);
            return;
        };

        setDelay(settings.maxTimeDelay - (Math.floor(score / 5) * 10)); // decrease delay by 10 every 5 points
    }

    function handleSetScore() {

        if (score > Number(localStorage.getItem('snakeScore'))) {
            localStorage.setItem('snakeScore', JSON.stringify(score));
        }
    };

    function checkCollision(head: number[]) {

        // checks if outside the canvas
        for (let i = 0; i < head.length; i++) {
            if (head[i] < 0 || head[i] * settings.scale >= settings.canvasX) return true;
        }

        // checks if snake hits itself
        for (const s of snake) {
            if (head[0] === s[0] && head[1] === s[1]) return true;
        }

        return false;
    }

    function appleAte(newSnake: number[][]) {

        let coordinate = rat.map(() => Math.floor(Math.random() * settings.canvasX / settings.scale));

        if (newSnake[0][0] === rat[0] && newSnake[0][1] === rat[1]) {
            let newApple = coordinate;

            setScore(score + 1);
            setRat(newApple);

            return true;
        }

        return false;
    }

    return (
        <div className='canvasContainer'>
            <canvas className='playArea' ref={canvasRef} width={`${settings.canvasX}px`} height={`${settings.canvasY}px`} />

            <img id='rat' src={Rat} alt='rat' />

            {props.gameOver && <div className='gameOver'>Game Over!</div>}

            {props.win && <div className='win'>You win!</div>}
        </div>
    )
}