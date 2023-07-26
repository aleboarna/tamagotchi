import { ReactComponent as SuperWoman } from '../assets/super-woman.svg';
import { LevelBar } from './level-bar';
import { useEffect, useState } from 'react';
import RetryModal from './retry-modal';

export function App() {
  const [healthLevel, setHealthLevel] = useState(
    Number(localStorage.getItem('health')) || 100
  );
  const [happinessLevel, setHappinessLevel] = useState(
    Number(localStorage.getItem('happiness')) || 100
  );
  const [isModalOpen, setIsModalOpen] = useState(
    happinessLevel === 0 || healthLevel === 0
  );
  const increaseHealth = () => {
    setHealthLevel(healthLevel + 5);
  };
  const increaseHappiness = () => {
    setHappinessLevel(happinessLevel + 5);
  };
  useEffect(() => {
    const timer = window.setInterval(() => {
      setHappinessLevel(happinessLevel - 1);
      setHealthLevel(healthLevel - 1);
      localStorage.setItem('happiness', `${happinessLevel}`);
      localStorage.setItem('health', `${healthLevel}`);
    }, 3000);
    if (happinessLevel === 0 || healthLevel === 0) {
      setIsModalOpen(true);
      return window.clearInterval(timer);
    }
    return () => window.clearInterval(timer);
  }, [healthLevel, happinessLevel]);

  const onRetryModal = () => {
    setHappinessLevel(100);
    setHealthLevel(100);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto box-border w-1/3">
      <RetryModal
        onRetryModal={onRetryModal}
        isOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
      />
      <h1 className="text-center text-xl pt-4 pb-10">Superwoman</h1>
      <div className="flex justify-evenly">
        <LevelBar level={healthLevel} name={'Health'} />
        <LevelBar level={happinessLevel} name={'Happiness'} />
      </div>
      <SuperWoman className="container" />
      {healthLevel === 0 || happinessLevel === 0 ? (
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={onRetryModal}
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="flex justify-evenly">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={increaseHealth}
          >
            Help
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={increaseHappiness}
          >
            Empower
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
