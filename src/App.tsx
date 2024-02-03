import { useState } from 'react';
import './App.css';
import { LeftSideContent } from './components/LeftSideContent';
import { PlayGroundContent } from './components/PlayGroundContent';
import { RightSideContent } from './components/RightSideContent';

function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="app">

      <LeftSideContent />

      <PlayGroundContent
        score={score}
        setScore={setScore}
      />

      <RightSideContent
        score={score}
      />

    </div>
  );
}

export default App;
