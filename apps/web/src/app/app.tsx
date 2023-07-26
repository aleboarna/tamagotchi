import { ReactComponent as SuperWoman } from '../assets/super-woman.svg';
import { LevelBar } from './level-bar';
import { useEffect, useRef, useState } from 'react';
import RetryModal from './retry-modal';
import { Link } from 'react-router-dom';
import { getLifeStage } from './right-lifecycle';
import { getStageProps } from './stage-modifier';

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

  const [age, setAge] = useState(Number(localStorage.getItem('age')) || 3);
  const modifiers = getStageProps(getLifeStage(age));
  const [countTries, setCountTries] = useState(0);

  const increaseHealth = () => {
    setHealthLevel(healthLevel + 5);
  };
  const increaseHappiness = () => {
    setHappinessLevel(happinessLevel + 5);
  };
  const happinessRef = useRef(happinessLevel);
  const healthRef = useRef(happinessLevel);
  const ageRef = useRef(age);

  useEffect(() => {
    healthRef.current = healthLevel;
  }, [healthLevel]);
  useEffect(() => {
    happinessRef.current = happinessLevel;
  }, [happinessLevel]);
  useEffect(() => {
    ageRef.current = age;
  }, [age]);

  useEffect(() => {
    const healthTimer = window.setInterval(() => {
      if (healthRef.current === 0) {
        clearInterval(healthTimer);
        clearInterval(happinessTimer);
        clearInterval(ageTimer);
        setIsModalOpen(true);
      } else {
        setHealthLevel((prevState) => prevState - 1);
        localStorage.setItem('health', `${healthRef.current - 1}`);
      }
    }, 500 * modifiers.healthModifier);
    const happinessTimer = window.setInterval(() => {
      if (happinessRef.current === 0) {
        clearInterval(healthTimer);
        clearInterval(happinessTimer);
        clearInterval(ageTimer);
        setIsModalOpen(true);
      } else {
        setHappinessLevel((prevState) => prevState - 1);
        localStorage.setItem('happiness', `${happinessRef.current - 1}`);
      }
    }, 500 * modifiers.happinessModifier);
    const ageTimer = window.setInterval(() => {
      setAge((prevState) => prevState + 1);
      localStorage.setItem('age', `${ageRef.current + 1}`);
    }, 10000);

    return () => {
      window.clearInterval(healthTimer);
      window.clearInterval(happinessTimer);
      window.clearInterval(ageTimer);
    };
  }, [countTries]);

  const onRetryModal = () => {
    setHappinessLevel(100);
    setHealthLevel(100);
    setAge(3);
    localStorage.setItem('happiness', '100');
    localStorage.setItem('health', '100');
    localStorage.setItem('age', '3');
    setIsModalOpen(false);
    setCountTries((prevState) => prevState + 1);
  };

  return (
    <div>
      <div className="flex justify-end pr-8 pt-3">
        <Link
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          to={'/login'}
        >
          Log in
        </Link>
      </div>
      <RetryModal
        onRetryModal={onRetryModal}
        isOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
      />
      <div className="container mx-auto box-border w-1/3">
        <h1 className="text-center text-xl pt-4 pb-10">Superwoman</h1>
        <div className="flex justify-evenly">
          <LevelBar level={healthLevel} name={'Health'} />
          <LevelBar level={happinessLevel} name={'Happiness'} />
          <LevelBar level={age} name={'Age'} />
        </div>
        <modifiers.image />
        {/*<SuperWoman className="container" />*/}
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
              onClick={healthLevel < 96 ? increaseHealth : undefined}
            >
              Support
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={happinessLevel < 96 ? increaseHappiness : undefined}
            >
              Empower
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
