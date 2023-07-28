import { LevelBar } from './level-bar';
import { useEffect, useRef, useState } from 'react';
import RetryModal from './retry-modal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getLifeStage } from './right-lifecycle';
import { getStageProps } from './stage-modifier';
import { ReactComponent as People } from '../assets/people.svg';

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = location.state || {};
  const [toggleGlobal, setToggleGlobal] = useState(false);

  useEffect(() => {
    if (!name) navigate('/login');
  }, [name]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible((prevIsVisible) => !prevIsVisible);
    }, 1800);

    // Clean up the timer when the component is unmounted
    return () => clearInterval(timer);
  }, []);
  const [healthLevel, setHealthLevel] = useState(
    Number(localStorage.getItem(`${name}-health`)) || 100
  );
  const [happinessLevel, setHappinessLevel] = useState(
    Number(localStorage.getItem(`${name}-happiness`)) || 100
  );
  const [isModalOpen, setIsModalOpen] = useState(
    happinessLevel === 0 || healthLevel === 0
  );

  const [age, setAge] = useState(
    Number(localStorage.getItem(`${name}-age`)) || 3
  );
  const [countTries, setCountTries] = useState(0);
  const modifiers = getStageProps(getLifeStage(age));

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
        localStorage.setItem(`${name}-health`, `${healthRef.current - 1}`);
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
        localStorage.setItem(
          `${name}-happiness`,
          `${happinessRef.current - 1}`
        );
      }
    }, 500 * modifiers.happinessModifier);
    const ageTimer = window.setInterval(() => {
      setAge((prevState) => prevState + 1);
      localStorage.setItem(`${name}-age`, `${ageRef.current + 1}`);
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
    localStorage.setItem(`${name}-happiness`, '100');
    localStorage.setItem(`${name}-health`, '100');
    localStorage.setItem(`${name}-age`, '3');
    setIsModalOpen(false);
    setCountTries((prevState) => prevState + 1);
  };

  return (
    <div className={'flex flex-col items-center justify-between min-h-screen'}>
      <div
        className={'w-full flex flex-row justify-between h-10 mt-1 pl-1 pr-1'}
      >
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={toggleGlobal}
            className="sr-only peer"
            onChange={() => {
              setToggleGlobal((prevState) => !prevState);
            }}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
          <span className="ml-3 text-sm font-medium ">Go Global</span>
        </label>
        <h1 className={' text-xl pt-4 pb-10'}>EmpowHER</h1>
        <Link
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          to={'/login'}
        >
          Change player
        </Link>
      </div>
      <RetryModal
        onRetryModal={onRetryModal}
        isOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
      />
      <div className={'flex justify-evenly w-2/5 pb-7'}>
        <LevelBar level={healthLevel} name={'Health'} />
        <LevelBar level={happinessLevel} name={'Happiness'} />
        <LevelBar level={age} name={'Age'} />
      </div>
      <div className={'flex flex-row justify-evenly'}>
        {' '}
        <div>leaderboard</div>
        <div className={'w-1/2 pb-10'}>
          <modifiers.image />
        </div>
        <div>story</div>
      </div>

      {healthLevel === 0 || happinessLevel === 0 ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={onRetryModal}
          >
            Try again
          </button>
        </div>
      ) : (
        <div className={'flex flex-row justify-around w-1/4'}>
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
      <div className={'relative bottom-0 flex flex-row w-full '}>
        <div className={`  absolute w-full flex justify-evenly`}>
          <p
            className={`text-xl font-bold italic  ease-in-out duration-100 delay-300  ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Stop making a mess
          </p>
          <p
            className={`text-xl font-bold italic  ease-in-out duration-100 delay-200  ${
              !isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Why aren't you listening
          </p>
          <p
            className={`text-xl font-bold italic ease-in-out duration-100 delay-100 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            You're a cry baby
          </p>
          <p
            className={`text-xl font-bold italic ease-in-out duration-100 ${
              !isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            You talk too much
          </p>
          <p
            className={`text-xl font-bold italic ease-in-out duration-100 delay-200  ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Why can't you be more like your sister
          </p>
        </div>
        <People></People>
        <People></People>
        <People></People>
        <People></People>
        <People></People>
        <People></People>
        <People></People>
      </div>
    </div>
  );
}

export default App;
