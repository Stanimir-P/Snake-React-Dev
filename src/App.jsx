import { useEffect, useRef, useState } from 'react';
import './App.css';
import Controls from './media/controls.png';
import Rat from './media/rat.png';
import Snake from './media/snake.png';
import SpaceKey from './media/spaceKey.png';
import useInterval from './useInterval';

const canvasX = 1000;
const canvasY = 1000;
const initialSnake = [[4, 10], [4, 10]];
const initialRat = [14, 10];
const scale = 50;
const minTimeDelay = 80;
const maxTimeDelay = 200;
const totalPoints = 324;

function App() {

  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(initialSnake);
  const [rat, setRat] = useState(initialRat);
  const [direction, setDirection] = useState([0, -1]);
  const [delay, setDelay] = useState(null);
  const [isPause, setIsPause] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [newGame, setNewGame] = useState(true);
  const [score, setScore] = useState(0);
  const highScore = localStorage.getItem('snakeScore');

  useInterval(() => runGame(), delay);

  useEffect(() => {

    let ratElement = document.getElementById('rat');

    if (canvasRef.current) {
      const canvas = canvasRef.current;

      const context = canvas.getContext('2d');

      if (context) {
        context.setTransform(scale, 0, 0, scale, 0, 0);

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
  }, [snake, rat]);

  function runGame() {
    if (isPause) { return; }

    calculateDelay(score);

    const newSnake = [...snake];
    const newSnakeHead = [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]];

    newSnake.unshift(newSnakeHead);

    if (score >= totalPoints) {
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

  function calculateDelay(score) {

    const minDelayScore = ((maxTimeDelay - minTimeDelay) / 10) * 5; // what score min delay is reached

    if (!score || score < 5) {
      setDelay(maxTimeDelay);
      return;
    }

    if (score >= minDelayScore) {
      setDelay(minTimeDelay);
      return;
    };

    setDelay(maxTimeDelay - (Math.floor(score / 5) * 10)); // decrease delay by 10 every 5 points
  }

  function handleSetScore() {

    if (score > Number(localStorage.getItem('snakeScore'))) {
      localStorage.setItem('snakeScore', JSON.stringify(score));
    }
  };

  function checkCollision(head) {

    // checks if outside the canvas
    for (let i = 0; i < head.length; i++) {
      if (head[i] < 0 || head[i] * scale >= canvasX) return true;
    }

    // checks if snake hits itself
    for (const s of snake) {
      if (head[0] === s[0] && head[1] === s[1]) return true;
    }

    return false;
  }

  function appleAte(newSnake) {

    let coordinate = rat.map(() => Math.floor(Math.random() * canvasX / scale));

    if (newSnake[0][0] === rat[0] && newSnake[0][1] === rat[1]) {
      let newApple = coordinate;

      setScore(score + 1);
      setRat(newApple);

      return true;
    }

    return false;
  }

  function play() {

    if (!gameOver && !win && !newGame) {

      if (isPause) {
        setIsPause(false);
        setDelay(maxTimeDelay);
        return;
      }

      setIsPause(true);
      setDelay(null);
      return;
    }

    setSnake(initialSnake);
    setRat(initialRat);
    setDirection([1, 0]);
    setDelay(maxTimeDelay);
    setIsPause(false);
    setGameOver(false);
    setWin(false);
    setNewGame(false);
    setScore(0);
  }

  function changeDirection(e) {

    const is180degrees =
      (e.key === 'ArrowLeft' && JSON.stringify(direction) === JSON.stringify([1, 0])) ||
      (e.key === 'ArrowUp' && JSON.stringify(direction) === JSON.stringify([0, 1])) ||
      (e.key === 'ArrowRight' && JSON.stringify(direction) === JSON.stringify([-1, 0])) ||
      (e.key === 'ArrowDown' && JSON.stringify(direction) === JSON.stringify([0, -1]));

    if (is180degrees) { return; }

    switch (e.key) {
      case 'ArrowLeft':
        setDirection([-1, 0]);
        break;

      case 'ArrowUp':
        setDirection([0, -1]);
        break;

      case 'ArrowRight':
        setDirection([1, 0]);
        break;

      case 'ArrowDown':
        setDirection([0, 1]);
        break;

      default:
        break;
    };
  };

  return (
    <div className="app" onKeyDown={(e) => changeDirection(e)}>

      {/* Left column */}

      <div className='leftColumn'>
        <img src={Snake} alt='rattlesnake' className='snake' />
      </div>

      {/* Center column */}

      <div className='centerColumn'>
        <div className='title'>
          Snake game
        </div>

        <div className='canvasContainer'>
          <canvas className='playArea' ref={canvasRef} width={`${canvasX}px`} height={`${canvasY}px`} />

          <img id='rat' src={Rat} alt='rat' />

          {gameOver && <div className='gameOver'>Game Over!</div>}

          {win && <div className='win'>You win!</div>}
        </div>


        <div className='playButtonContainer'>
          <button onClick={play} className='playButton'>{(newGame || isPause) ? 'Play' : 'Pause'}</button>
        </div>
      </div>

      {/* Right column */}

      <div className='rightColumn'>

        <div className='scoreBoxContainer'>

          <div className='scoreBox'>
            <div className='score'>Score:{score}</div>

            <div className='highScore'>High Score:{highScore ? highScore : 0}</div>
          </div>
        </div>

        <div className='controlsContainer'>
          <div className='arrowKeys'>
            <img src={Controls} height='60' width='100' alt='arrowKeys' />

            <div className='arrowsTitle'>- Move</div>
          </div>

          <div className='spaceKey'>
            <img src={SpaceKey} height='30' width='50' alt='spaceKey' />

            <div className='spaceTitle'>- Pause</div>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ display: 'flex', flex: 1 }}></div>
      </div>
    </div>
  );
}

export default App;
