// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { ReactComponent as SuperWoman } from '../assets/super-woman.svg';
import { LevelBar } from './level-bar';
import { useEffect, useState } from 'react';

export function App() {
  const [healthLevel, setHealthLevel] = useState(45);
  const [happinessLevel, setHappinessLevel] = useState(60);

  const increaseHealth = () => {
    setHealthLevel((prevState) => prevState + 5);
  };
  const increaseHappiness = () => {
    setHappinessLevel((prevState) => prevState + 5);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setHappinessLevel((prevState) => prevState - 1);
      setHealthLevel((prevState) => prevState - 1);
    }, 3000);
    if (happinessLevel === 0 || healthLevel === 0) {
      return clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  });
  return (
    <div className="container mx-auto box-border w-1/3">
      <h1 className="text-center text-xl pt-4 pb-10">Superwoman</h1>
      <div className="flex justify-evenly">
        <LevelBar level={healthLevel} name={'Health'} />
        <LevelBar level={happinessLevel} name={'Happiness'} />
      </div>
      <SuperWoman className="container" />
      <div className="flex justify-evenly">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={increaseHealth}
        >
          Feed
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={increaseHappiness}
        >
          Play
        </button>
      </div>
    </div>
  );
}

export default App;
